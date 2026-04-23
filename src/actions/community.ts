"use server";

import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { Limiters } from "@/lib/utils/rate-limit";

export async function getTopics() {
	try {
		const topics = await db.communityTopic.findMany({
			orderBy: { sortOrder: "asc" }
		});
		return { success: true, topics };
	} catch (error) {
		console.error("Error fetching topics:", error);
		return { success: false, error: "Failed to fetch topics" };
	}
}

export type PostWithCounts = Prisma.CommunityPostGetPayload<{
	include: {
		_count: {
			select: { replies: true }
		},
		topic: true
	}
}> & { voteScore: number };

export async function getPosts(options?: { topicSlug?: string, sortBy?: "recent" | "popular", limit?: number }) {
	const limit = options?.limit || 20;
	const sortBy = options?.sortBy || "recent";
	
	try {
		const whereClause: Prisma.CommunityPostWhereInput = {
			status: "APPROVED"
		};

		if (options?.topicSlug) {
			whereClause.topic = { slug: options.topicSlug };
		}

		// Fetch posts
		const posts = await db.communityPost.findMany({
			where: whereClause,
			include: {
				_count: {
					select: { replies: true }
				},
				topic: true,
				// We must calculate votes manually or fetch them and sum them up
				votes: {
					select: { value: true }
				}
			},
			orderBy: sortBy === "recent" ? { createdAt: "desc" } : undefined,
			take: limit,
		});

		// Map to calculate voteScore
		const mappedPosts: PostWithCounts[] = posts.map(post => {
			const voteScore = post.votes.reduce((acc, vote) => acc + vote.value, 0);
			const { votes, ...rest } = post; // Exclude raw votes array
			return { ...rest, voteScore };
		});

		if (sortBy === "popular") {
			mappedPosts.sort((a, b) => b.voteScore - a.voteScore);
		}

		return { success: true, posts: mappedPosts };
	} catch (error) {
		console.error("Error fetching posts:", error);
		return { success: false, error: "Failed to fetch posts" };
	}
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createPost(data: { title: string, body: string, topicId: string, isAnonymous: boolean }) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		// Rate limiting — 10 posts per hour
		const { success: withinLimit } = await Limiters.communityPost(session.user.id);
		if (!withinLimit) {
			return { success: false, error: "You're posting too frequently. Please wait before posting again." };
		}

		// Check for premium tier if needed
		if ((session.user as any).role === "USER") {
			return { success: false, error: "Premium subscription required to post." };
		}

		const post = await db.communityPost.create({
			data: {
				title: data.title,
				body: data.body,
				topicId: data.topicId,
				authorId: session.user.id,
				isAnonymous: data.isAnonymous,
				status: "PENDING", // Start as PENDING for AI moderation
			}
		});

		// Run AI Moderation in the background
		import("@/lib/ai").then(({ moderateContent }) => {
			moderateContent(data.title + "\n" + data.body).then(async (moderation) => {
				await db.communityPost.update({
					where: { id: post.id },
					data: { status: moderation.status }
				});
				revalidatePath("/community");
				revalidatePath(`/community/${data.topicId}`);
			});
		});

		revalidatePath("/community");
		revalidatePath(`/community/${data.topicId}`);
		
		return { success: true, post };
	} catch (error) {
		console.error("Error creating post:", error);
		return { success: false, error: "Failed to create post" };
	}
}

export async function getPostById(id: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});
		const userId = session?.user?.id;

		const post = await db.communityPost.findUnique({
			where: { id },
			include: {
				topic: true,
				votes: true,
				replies: {
					where: { parentId: null }, // Only top-level
					include: {
						votes: true,
						children: {
							include: {
								votes: true,
							},
							orderBy: { createdAt: "asc" }
						}
					},
					orderBy: { createdAt: "asc" }
				}
			}
		});

		if (!post) {
			return { success: false, error: "Post not found" };
		}

		// Calculate vote scores and user vote status for the post
		let userVote = 0;
		if (userId) {
			const uVote = post.votes.find(v => v.userId === userId);
			if (uVote) userVote = uVote.value;
		}
		const voteScore = post.votes.reduce((acc, vote) => acc + vote.value, 0);

		// Recursively calculate for replies
		const mapReply = (reply: any) => {
			let rUserVote = 0;
			if (userId) {
				const ruVote = reply.votes.find((v: any) => v.userId === userId);
				if (ruVote) rUserVote = ruVote.value;
			}
			const rVoteScore = reply.votes.reduce((acc: number, vote: any) => acc + vote.value, 0);
			const { votes, ...rest } = reply;
			return {
				...rest,
				voteScore: rVoteScore,
				userVote: rUserVote,
				children: rest.children ? rest.children.map(mapReply) : []
			};
		};

		const mappedReplies = post.replies.map(mapReply);
		const { votes, ...restPost } = post;

		const mappedPost = {
			...restPost,
			voteScore,
			userVote,
			replies: mappedReplies
		};

		return { success: true, post: mappedPost };
	} catch (error) {
		console.error("Error fetching post:", error);
		return { success: false, error: "Failed to fetch post" };
	}
}

export async function createReply(data: { postId: string, parentId?: string, body: string, isAnonymous: boolean }) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		if ((session.user as any).role === "USER") {
			return { success: false, error: "Premium subscription required to reply." };
		}

		const reply = await db.communityReply.create({
			data: {
				postId: data.postId,
				parentId: data.parentId || null,
				body: data.body,
				authorId: session.user.id,
				isAnonymous: data.isAnonymous,
				status: "PENDING"
			}
		});

		// Run AI Moderation in the background
		import("@/lib/ai").then(({ moderateContent }) => {
			moderateContent(data.body).then(async (moderation) => {
				await db.communityReply.update({
					where: { id: reply.id },
					data: { status: moderation.status }
				});
				revalidatePath(`/community/post/${data.postId}`);
			});
		});

		revalidatePath(`/community/post/${data.postId}`);
		return { success: true, reply };
	} catch (error) {
		console.error("Error creating reply:", error);
		return { success: false, error: "Failed to create reply" };
	}
}

export async function vote(data: { targetId: string, type: "post" | "reply", value: 1 | -1 | 0 }) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const userId = session.user.id;

		if (data.value === 0) {
			// Remove vote
			if (data.type === "post") {
				await db.vote.deleteMany({
					where: { userId, postId: data.targetId }
				});
			} else {
				await db.vote.deleteMany({
					where: { userId, replyId: data.targetId }
				});
			}
		} else {
			// Upsert vote
			if (data.type === "post") {
				const existing = await db.vote.findFirst({
					where: { userId, postId: data.targetId }
				});
				if (existing) {
					await db.vote.update({
						where: { id: existing.id },
						data: { value: data.value }
					});
				} else {
					await db.vote.create({
						data: { userId, postId: data.targetId, value: data.value }
					});
				}
			} else {
				const existing = await db.vote.findFirst({
					where: { userId, replyId: data.targetId }
				});
				if (existing) {
					await db.vote.update({
						where: { id: existing.id },
						data: { value: data.value }
					});
				} else {
					await db.vote.create({
						data: { userId, replyId: data.targetId, value: data.value }
					});
				}
			}
		}

		// We don't revalidatePath here because optimistic UI handles the immediate change
		// But in a real app you might want to revalidate to sync across devices.
		
		return { success: true };
	} catch (error) {
		console.error("Error voting:", error);
		return { success: false, error: "Failed to vote" };
	}
}

import { z } from "zod";

export const postSchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title cannot exceed 100 characters"),
	content: z.string().min(10, "Post content must be at least 10 characters long"),
	topicId: z.string().optional(),
	isAnonymous: z.boolean().default(false),
});

export type PostInput = z.infer<typeof postSchema>;

export const replySchema = z.object({
	postId: z.string().min(1, "Post ID is required"),
	content: z.string().min(2, "Reply cannot be empty"),
	isAnonymous: z.boolean().default(false),
});

export type ReplyInput = z.infer<typeof replySchema>;

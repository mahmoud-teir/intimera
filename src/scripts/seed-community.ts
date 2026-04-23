import { db as prisma } from "../lib/db";

async function main() {
	console.log("Seeding Community Topics...");

	const topics = [
		{ name: "General Support", slug: "general", description: "General relationship advice and support." },
		{ name: "Communication", slug: "communication", description: "Navigating difficult conversations." },
		{ name: "Intimacy", slug: "intimacy", description: "Physical and emotional connection." },
		{ name: "Trust & Betrayal", slug: "trust", description: "Rebuilding trust and healing." },
		{ name: "Long Distance", slug: "long-distance", description: "Managing a relationship from afar." },
	];

	for (let i = 0; i < topics.length; i++) {
		const topic = topics[i];
		await prisma.communityTopic.upsert({
			where: { slug: topic.slug },
			update: { sortOrder: i },
			create: { ...topic, sortOrder: i },
		});
	}

	console.log("Community Topics seeded.");

	// Optionally add dummy posts if in development and none exist
	const postCount = await prisma.communityPost.count();
	if (postCount === 0) {
		const user = await prisma.user.findFirst();
		if (user) {
			const generalTopic = await prisma.communityTopic.findUnique({ where: { slug: "general" } });
			const commsTopic = await prisma.communityTopic.findUnique({ where: { slug: "communication" } });

			if (generalTopic && commsTopic) {
				await prisma.communityPost.create({
					data: {
						title: "How do you handle different stress responses?",
						body: "My partner shuts down when stressed, while I need to talk it out immediately. It causes a lot of friction. Any advice on how to bridge this gap?",
						topicId: generalTopic.id,
						authorId: user.id,
						isAnonymous: true,
						status: "APPROVED",
					}
				});

				await prisma.communityPost.create({
					data: {
						title: "Trying the 'Soft Start-up' technique",
						body: "Read about Gottman's soft start-up here and tried it last night. It actually prevented a fight that usually happens when we discuss finances. Highly recommend!",
						topicId: commsTopic.id,
						authorId: user.id,
						isAnonymous: true,
						status: "APPROVED",
					}
				});

				console.log("Dummy posts seeded.");
			}
		} else {
			console.log("No users found, skipping dummy posts.");
		}
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

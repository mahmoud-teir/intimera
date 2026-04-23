import { PrismaClient } from "../src/generated/prisma/client";
import { Role, SubscriptionTier, ContentStatus, Difficulty, RelationshipStage, ExerciseType, StepType } from "../src/generated/prisma/enums";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("Neither DIRECT_URL nor DATABASE_URL is set in environment");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Seeding database...");

	// 1. Categories
	const categories = [
		{ slug: "communication", name: "Communication", description: "Learn to express your needs and listen deeply.", icon: "MessageCircle", sortOrder: 1 },
		{ slug: "intimacy", name: "Physical & Emotional Intimacy", description: "Deepen your physical and emotional bond.", icon: "Heart", sortOrder: 2 },
		{ slug: "conflict-resolution", name: "Conflict Resolution", description: "Navigating disagreements with grace and empathy.", icon: "ShieldCheck", sortOrder: 3 },
		{ slug: "future-planning", name: "Future Planning", description: "Aligning your dreams and goals.", icon: "Compass", sortOrder: 4 },
	];

	for (const cat of categories) {
		await prisma.category.upsert({
			where: { slug: cat.slug },
			update: cat,
			create: cat,
		});
	}

	const catMap = await prisma.category.findMany().then(cats => 
		Object.fromEntries(cats.map(c => [c.slug, c.id]))
	);

	// 2. Content (Articles)
	const contents = [
		{
			slug: "the-art-of-active-listening",
			categoryId: catMap["communication"],
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 6,
			translations: {
				create: {
					locale: "en",
					title: "The Art of Active Listening",
					summary: "Communication is 90% listening. Discover how to truly hear your partner.",
					body: "# The Art of Active Listening\n\nActive listening is a structured way of listening and responding to others...",
				}
			}
		},
		{
			slug: "rekindling-the-spark",
			categoryId: catMap["intimacy"],
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.LONG_TERM,
			readingTimeMin: 10,
			translations: {
				create: {
					locale: "en",
					title: "Rekindling the Spark",
					summary: "Simple daily habits to maintain attraction and deep intimacy.",
					body: "# Rekindling the Spark\n\nMaintaining a romantic connection over years requires intentionality...",
				}
			}
		},
	];

	for (const content of contents) {
		// Check if it already exists to avoid duplication of translations in create
		const existing = await prisma.content.findUnique({ where: { slug: content.slug } });
		if (existing) {
			await prisma.content.update({
				where: { slug: content.slug },
				data: {
					categoryId: content.categoryId,
					tier: content.tier,
					status: content.status,
					difficulty: content.difficulty,
					relationshipStage: content.relationshipStage,
					readingTimeMin: content.readingTimeMin,
				}
			});
		} else {
			await prisma.content.create({ data: content });
		}
	}

	// 3. Exercises
	const exercises = [
		{
			slug: "the-appreciation-jar",
			type: ExerciseType.INDIVIDUAL,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 15,
			title: "The Appreciation Jar",
			description: "A simple daily practice to focus on what you love about each other.",
			steps: {
				create: [
					{ stepNumber: 1, type: StepType.TEXT, locale: "en", title: "Find a Jar", content: "Find a physical jar or create a digital one in your Shared Notes." },
					{ stepNumber: 2, type: StepType.TEXT, locale: "en", title: "Daily Note", content: "Write one thing you appreciated about your partner today." },
					{ stepNumber: 3, type: StepType.TEXT, locale: "en", title: "Sunday Reveal", content: "Read the notes together every Sunday evening." },
				]
			}
		},
		{
			slug: "eye-gazing-connection",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 5,
			title: "Eye Gazing Connection",
			description: "Experience the profound intimacy of silence and visual presence.",
			steps: {
				create: [
					{ stepNumber: 1, type: StepType.TEXT, locale: "en", title: "Set the Scene", content: "Sit comfortably facing each other in a quiet, dimly lit space." },
					{ stepNumber: 2, type: StepType.TEXT, locale: "en", title: "Gaze", content: "Set a timer for 4 minutes. Look into each other's eyes without speaking." },
					{ stepNumber: 3, type: StepType.TEXT, locale: "en", title: "Reflect", content: "Share what feelings arose during the silence." },
				]
			}
		}
	];

	for (const ex of exercises) {
		const existing = await prisma.exercise.findUnique({ where: { slug: ex.slug } });
		if (existing) {
			await prisma.exercise.update({
				where: { slug: ex.slug },
				data: {
					type: ex.type,
					tier: ex.tier,
					status: ex.status,
					difficulty: ex.difficulty,
					relationshipStage: ex.relationshipStage,
					estimatedTimeMin: ex.durationMin,
					title: ex.title,
					description: ex.description,
				}
			});
		} else {
			await prisma.exercise.create({
				data: {
					slug: ex.slug,
					type: ex.type,
					tier: ex.tier,
					status: ex.status,
					difficulty: ex.difficulty,
					relationshipStage: ex.relationshipStage,
					estimatedTimeMin: ex.durationMin,
					title: ex.title,
					description: ex.description,
					steps: {
						create: ex.steps.create.map(({ content, ...step }) => ({
							...step,
							type: StepType.TEXT_PROMPT,
							instruction: content,
						}))
					}
				}
			});
		}
	}

	console.log("✅ Seeding complete!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});

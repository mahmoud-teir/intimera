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
	console.log("🌱 Seeding Extended Content...");

	const catMap = await prisma.category.findMany().then(cats => 
		Object.fromEntries(cats.map(c => [c.slug, c.id]))
	);

	const intimacyCat = catMap["intimacy"];
	const commCat = catMap["communication"];

	// 1. Articles (10)
	const articles = [
		{
			slug: "anatomy-of-arousal",
			categoryId: intimacyCat,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 8,
			coverImage: "/content/anatomy-of-arousal.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "The Anatomy of Arousal",
						summary: "Explore the biological and psychological mechanisms behind arousal.",
						body: "# The Anatomy of Arousal\n\nArousal is a complex interplay of physical, emotional, and psychological factors. The dual-control model suggests we have an 'accelerator' and 'brakes' for desire. Understanding your personal triggers can significantly enhance intimate experiences."
					},
					{
						locale: "ar",
						title: "تشريح الإثارة",
						summary: "استكشاف الآليات البيولوجية والنفسية وراء الإثارة الجسدية.",
						body: "# تشريح الإثارة\n\nالإثارة هي تفاعل معقد بين العوامل الجسدية والعاطفية والنفسية. يقترح نموذج التحكم المزدوج أن لدينا 'دواسة وقود' و'مكابح' للرغبة. فهم محفزاتك الشخصية يمكن أن يعزز التجارب الحميمة بشكل كبير."
					}
				]
			}
		},
		{
			slug: "sensate-focus-guide",
			categoryId: intimacyCat,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 10,
			coverImage: "/content/sensate-focus.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "Sensate Focus: A Clinical Guide",
						summary: "Learn the foundational Masters & Johnson technique for overcoming anxiety.",
						body: "# Sensate Focus\n\nSensate focus is a technique developed by Masters and Johnson to help couples overcome performance anxiety by focusing on non-goal-oriented touch."
					},
					{
						locale: "ar",
						title: "التركيز الحسي: دليل سريري",
						summary: "تعلم تقنية ماسترز وجونسون الأساسية للتغلب على القلق الأدائي.",
						body: "# التركيز الحسي\n\nالتركيز الحسي هو تقنية طورها ماسترز وجونسون لمساعدة الأزواج في التغلب على قلق الأداء من خلال التركيز على اللمس غير الموجه نحو هدف."
					}
				]
			}
		},
		{
			slug: "mastering-kegels",
			categoryId: intimacyCat,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 5,
			coverImage: "/content/mastering-kegels.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "Mastering Pelvic Floor Wellness",
						summary: "How strengthening your pelvic floor can enhance sensation and health.",
						body: "# Mastering the Pelvic Floor\n\nThe pelvic floor muscles play a critical role in sexual function for all genders. Regular practice of Kegels can lead to stronger sensations and better control."
					},
					{
						locale: "ar",
						title: "إتقان صحة قاع الحوض",
						summary: "كيف يمكن لتقوية قاع الحوض أن تعزز الإحساس والصحة الجنسية.",
						body: "# إتقان قاع الحوض\n\nتلعب عضلات قاع الحوض دورًا حاسمًا في الوظيفة الجنسية لجميع الأجناس. يمكن أن تؤدي الممارسة المنتظمة لتمارين كيجل إلى أحاسيس أقوى وتحكم أفضل."
					}
				]
			}
		},
		{
			slug: "vocal-communication-intimacy",
			categoryId: commCat,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 7,
			coverImage: "/content/vocal-communication.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "The Art of Vocal Communication",
						summary: "Verbalizing desires without shame.",
						body: "# Vocal Communication in Intimacy\n\nSpeaking about what you want during intimate moments can be vulnerable. Start by sharing positive feedback ('I love when you do that') to build confidence."
					},
					{
						locale: "ar",
						title: "فن التواصل اللفظي في العلاقة",
						summary: "التعبير عن الرغبات بصوت عالٍ دون خجل.",
						body: "# التواصل اللفظي في الحميمية\n\nقد يكون التحدث عما تريده أثناء اللحظات الحميمة أمرًا حساساً. ابدأ بمشاركة التعليقات الإيجابية ('أحب عندما تفعل ذلك') لبناء الثقة."
					}
				]
			}
		},
		{
			slug: "libido-mismatches",
			categoryId: commCat,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ESTABLISHED,
			readingTimeMin: 12,
			coverImage: "/content/libido-mismatches.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "Navigating Libido Mismatches",
						summary: "Understanding and managing different levels of sexual desire.",
						body: "# Navigating Libido Mismatches\n\nIt is entirely normal for partners to have mismatched sex drives. The goal is not to force alignment, but to find a compassionate middle ground."
					},
					{
						locale: "ar",
						title: "التعامل مع تباين الرغبة",
						summary: "فهم وإدارة المستويات المختلفة من الرغبة الجنسية بين الشريكين.",
						body: "# التعامل مع تباين الرغبة\n\nمن الطبيعي تمامًا أن يكون لدى الشركاء دوافع جنسية غير متطابقة. الهدف ليس فرض التوافق، بل إيجاد أرضية وسطى مبنية على التعاطف."
					}
				]
			}
		},
		{
			slug: "psychology-of-desire",
			categoryId: intimacyCat,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 9,
			coverImage: "/content/anatomy-of-arousal.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "The Psychology of Desire",
						summary: "Spontaneous vs. responsive desire models.",
						body: "# Spontaneous vs Responsive Desire\n\nNot everyone feels spontaneous lust out of nowhere. Many experience responsive desire, which emerges only after intimacy has already begun."
					},
					{
						locale: "ar",
						title: "سيكولوجية الرغبة",
						summary: "نماذج الرغبة العفوية مقابل الرغبة الاستجابية.",
						body: "# الرغبة العفوية مقابل الاستجابية\n\nلا يشعر الجميع بالرغبة العفوية فجأة. يعاني الكثيرون من الرغبة الاستجابية، والتي تظهر فقط بعد بدء اللحظات الحميمة."
					}
				]
			}
		},
		{
			slug: "overcoming-performance-anxiety",
			categoryId: intimacyCat,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 11,
			coverImage: "/content/sensate-focus.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "Overcoming Performance Anxiety",
						summary: "Mindfulness techniques to stay present.",
						body: "# Overcoming Performance Anxiety\n\nAnxiety takes you out of your body and into your head (spectatoring). Mindfulness and breathing exercises can ground you back into the present sensation."
					},
					{
						locale: "ar",
						title: "التغلب على قلق الأداء",
						summary: "تقنيات اليقظة الذهنية للبقاء في اللحظة الحالية.",
						body: "# التغلب على قلق الأداء\n\nالقلق يخرجك من جسدك ويجعلك في رأسك كمراقب. يمكن أن تعيدك تمارين اليقظة والتنفس إلى الإحساس الحالي."
					}
				]
			}
		},
		{
			slug: "exploring-fantasies-safely",
			categoryId: commCat,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ESTABLISHED,
			readingTimeMin: 10,
			coverImage: "/content/vocal-communication.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "Exploring Fantasies Safely",
						summary: "How to share your deepest fantasies without shame.",
						body: "# Exploring Fantasies Safely\n\nSharing fantasies requires profound trust. Approach the conversation with curiosity rather than judgment, assuring your partner that a fantasy doesn't always equal a desire to act it out."
					},
					{
						locale: "ar",
						title: "استكشاف الخيالات بأمان",
						summary: "كيف تشارك أعمق خيالاتك دون الشعور بالخجل.",
						body: "# استكشاف الخيالات بأمان\n\nمشاركة الخيالات تتطلب ثقة عميقة. تعامل مع المحادثة بفضول بدلاً من الحكم، مع التأكيد لشريكك على أن الخيال لا يعني دائمًا الرغبة في تمثيله في الواقع."
					}
				]
			}
		},
		{
			slug: "aftercare-dysphoria",
			categoryId: intimacyCat,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.ANY,
			readingTimeMin: 6,
			coverImage: "/content/libido-mismatches.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "Post-Coital Dysphoria & Aftercare",
						summary: "Why you might feel sad after intimacy and how aftercare helps.",
						body: "# Post-Coital Dysphoria (PCD)\n\nPCD is a feeling of melancholy or anxiety following consensual sex. This is a normal neurochemical drop. Aftercare—cuddling, gentle words, and hydration—is essential to re-regulate the nervous system."
					},
					{
						locale: "ar",
						title: "الرعاية اللاحقة وحزن ما بعد العلاقة",
						summary: "لماذا قد تشعر بالحزن بعد الحميمية وكيف تساعد الرعاية اللاحقة.",
						body: "# انزعاج ما بعد العلاقة (PCD)\n\nهو شعور بالكآبة أو القلق بعد علاقة حميمة بالتراضي. هذا انخفاض طبيعي في الكيمياء العصبية. الرعاية اللاحقة كالعناق والكلمات اللطيفة ضرورية لإعادة تنظيم الجهاز العصبي."
					}
				]
			}
		},
		{
			slug: "eroticism-long-term",
			categoryId: intimacyCat,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ESTABLISHED,
			readingTimeMin: 14,
			coverImage: "/content/mastering-kegels.png",
			translations: {
				create: [
					{
						locale: "en",
						title: "Eroticism in Long-Term Relationships",
						summary: "Reconciling the need for safety with the desire for novelty.",
						body: "# Keeping the Spark Alive\n\nLove seeks closeness and familiarity, while desire seeks mystery and distance. Balancing these two requires intentional acts of separation and playful reconnection."
					},
					{
						locale: "ar",
						title: "الإثارة في العلاقات طويلة الأمد",
						summary: "التوفيق بين الحاجة إلى الأمان والرغبة في التجديد.",
						body: "# إبقاء الشعلة متقدة\n\nالحب يسعى للقرب والألفة، بينما الرغبة تسعى للغموض والمسافة. الموازنة بين هذين الأمرين تتطلب أفعالاً متعمدة من الانفصال وإعادة الاتصال بمرح."
					}
				]
			}
		}
	];

	for (const content of articles) {
		const existing = await prisma.content.findUnique({ where: { slug: content.slug } });
		if (existing) {
			console.log(`Updating article: ${content.slug}`);
			// delete old translations to avoid conflicts
			await prisma.contentTranslation.deleteMany({ where: { contentId: existing.id } });
			
			await prisma.content.update({
				where: { slug: content.slug },
				data: {
					categoryId: content.categoryId,
					tier: content.tier,
					status: content.status,
					difficulty: content.difficulty,
					relationshipStage: content.relationshipStage,
					readingTimeMin: content.readingTimeMin,
					coverImage: content.coverImage,
					translations: content.translations
				}
			});
		} else {
			console.log(`Creating article: ${content.slug}`);
			await prisma.content.create({ data: content });
		}
	}

	// 2. Exercises (10)
	const exercises = [
		{
			slug: "guided-body-scan",
			type: ExerciseType.INDIVIDUAL,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 15,
			title: "Guided Body Scan",
			description: "Reconnect with your own body's sensations without judgment.",
			coverImage: "/content/guided_body_scan.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Find a quiet space", content_en: "Lie down comfortably in a dark room.", locale_ar: "مساحة هادئة", content_ar: "استلق براحة في غرفة مظلمة." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Breathe", content_en: "Take deep, slow breaths, focusing entirely on the rise and fall of your chest.", locale_ar: "تنفس", content_ar: "خذ أنفاساً عميقة وبطيئة، وركز على ارتفاع وانخفاض صدرك." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Scan", content_en: "Mentally scan your body from toes to head, noticing any tension.", locale_ar: "مسح جسدي", content_ar: "امسح جسدك عقلياً من أصابع القدم إلى الرأس، ولاحظ أي توتر." }
			]
		},
		{
			slug: "mutual-massage-flow",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 30,
			title: "Mutual Massage Flow",
			description: "A sensory journey using warm oils and intentional touch.",
			coverImage: "/content/mutual_massage_flow.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Preparation", content_en: "Warm some massage oil. The giver should ensure their hands are warm.", locale_ar: "التحضير", content_ar: "قم بتسخين زيت التدليك. يجب أن يتأكد المانح من دفء يديه." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Broad Strokes", content_en: "Start with broad, sweeping strokes across the back, avoiding deep tissue work.", locale_ar: "حركات واسعة", content_ar: "ابدأ بحركات واسعة على الظهر، متجنباً الضغط العميق." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Switch", content_en: "After 15 minutes, switch roles and thank each other.", locale_ar: "التبديل", content_ar: "بعد 15 دقيقة، تبادلا الأدوار واشكرا بعضكما." }
			]
		},
		{
			slug: "eye-gazing-intimacy",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 5,
			title: "Soulful Eye Gazing",
			description: "5 minutes of uninterrupted eye contact to build emotional resonance.",
			coverImage: "/content/eye_gazing.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Sit Together", content_en: "Sit cross-legged facing each other, knees touching.", locale_ar: "الجلوس معاً", content_ar: "اجلسا متقابلين، وتتلامس الركبتان." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Gaze", content_en: "Set a timer. Look directly into the left eye of your partner (the receptive eye).", locale_ar: "النظر", content_ar: "اضبط مؤقتاً. انظر مباشرة في العين اليسرى لشريكك." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Breathe Together", content_en: "Try to sync your breathing. Do not speak. Allow emotions to pass.", locale_ar: "التنفس المشترك", content_ar: "حاول مزامنة تنفسكما. لا تتحدثا. اسمحا للمشاعر بالمرور." }
			]
		},
		{
			slug: "rhythmic-breathing",
			type: ExerciseType.INDIVIDUAL,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 5,
			title: "Rhythmic Breathing",
			description: "Calm your nervous system before intimacy using a 4-7-8 pattern.",
			coverImage: "/content/rhythmic_breathing.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Inhale", content_en: "Breathe in quietly through the nose for 4 seconds.", locale_ar: "شهيق", content_ar: "استنشق بهدوء عبر الأنف لمدة 4 ثوان." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Hold", content_en: "Hold the breath for 7 seconds.", locale_ar: "حبس", content_ar: "احبس أنفاسك لمدة 7 ثوان." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Exhale", content_en: "Exhale completely through the mouth, making a whoosh sound, for 8 seconds.", locale_ar: "زفير", content_ar: "أخرج الزفير بالكامل عن طريق الفم لمدة 8 ثوان." }
			]
		},
		{
			slug: "yes-no-maybe",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 20,
			title: "Yes, No, Maybe Inventory",
			description: "A structured communication exercise to safely explore boundaries.",
			coverImage: "/content/yes_no_maybe.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Prepare Lists", content_en: "Independently write down 5 intimate acts or fantasies.", locale_ar: "إعداد القوائم", content_ar: "اكتب بشكل مستقل 5 أفعال حميمة أو خيالات." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Exchange & Categorize", content_en: "Exchange lists. For each item, mark it as 'Yes', 'No', or 'Maybe'.", locale_ar: "التبادل والتصنيف", content_ar: "تبادلا القوائم. لكل عنصر، ضع علامة 'نعم'، 'لا'، أو 'ربما'." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Discuss the Maybes", content_en: "Gently discuss the 'Maybe' items to understand conditions and feelings.", locale_ar: "مناقشة 'ربما'", content_ar: "ناقش عناصر 'ربما' بلطف لفهم الظروف والمشاعر." }
			]
		},
		{
			slug: "sensate-focus-phase-1",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 20,
			title: "Sensate Focus: Phase 1",
			description: "Non-genital touching to build trust and presence without expectations.",
			coverImage: "/content/guided_body_scan.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Agreement", content_en: "Agree that this exercise will NOT lead to sex. The goal is purely sensory.", locale_ar: "الاتفاق", content_ar: "اتفقا على أن هذا التمرين لن يؤدي إلى علاقة. الهدف حسي بحت." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Touch", content_en: "Take turns touching each other's body (excluding genitals). Focus purely on texture and temperature.", locale_ar: "اللمس", content_ar: "تبادلا لمس أجساد بعضكما. ركزا فقط على الملمس والحرارة." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Feedback", content_en: "Provide minimal feedback, only speaking to adjust pressure if uncomfortable.", locale_ar: "الملاحظات", content_ar: "قدما ملاحظات في حدها الأدنى، فقط لتعديل الضغط إذا كان غير مريح." }
			]
		},
		{
			slug: "desire-mapping",
			type: ExerciseType.INDIVIDUAL,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.INTERMEDIATE,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 15,
			title: "Desire Mapping",
			description: "Identify your personal accelerators and brakes for intimacy.",
			coverImage: "/content/yes_no_maybe.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Accelerators", content_en: "List 3 things that reliably turn you on or make you feel intimate.", locale_ar: "المحفزات", content_ar: "اكتب 3 أشياء تثيرك أو تجعلك تشعر بالحميمية." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Brakes", content_en: "List 3 things (stressors, environment) that completely shut down your desire.", locale_ar: "المكابح", content_ar: "اكتب 3 أشياء (توتر، بيئة) توقف رغبتك تماماً." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Action Plan", content_en: "Identify one brake you can mitigate this week.", locale_ar: "خطة العمل", content_ar: "حدد مانعاً واحداً يمكنك التخفيف منه هذا الأسبوع." }
			]
		},
		{
			slug: "intimacy-check-in",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.FREE,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.BEGINNER,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 10,
			title: "The Weekly Intimacy Check-In",
			description: "A structured weekly conversation to maintain emotional safety.",
			coverImage: "/content/eye_gazing.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Gratitude", content_en: "Share one intimate moment or gesture from this week you appreciated.", locale_ar: "الامتنان", content_ar: "شارك لحظة حميمة من هذا الأسبوع شعرت بالامتنان تجاهها." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Needs", content_en: "Share one emotional or physical need you have for the upcoming week.", locale_ar: "الاحتياجات", content_ar: "شارك حاجة عاطفية أو جسدية لديك للأسبوع القادم." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Commitment", content_en: "Agree on one small action to fulfill each other's needs.", locale_ar: "الالتزام", content_ar: "اتفقا على فعل صغير واحد لتلبية احتياجات بعضكما." }
			]
		},
		{
			slug: "sharing-a-fantasy",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ESTABLISHED,
			durationMin: 20,
			title: "Sharing a Fantasy",
			description: "A safe framework to verbally explore erotic imagination together.",
			coverImage: "/content/mutual_massage_flow.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Ground Rules", content_en: "Agree to listen without judgment. Reiterate that fantasy is fiction.", locale_ar: "القواعد", content_ar: "اتفقا على الاستماع دون حكم. أكدا أن الخيال هو مجرد خيال." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "The Reveal", content_en: "Partner A shares a mild to moderate fantasy. Partner B only asks curious questions.", locale_ar: "الكشف", content_ar: "يشارك الشريك (أ) خيالاً معتدلاً. الشريك (ب) يطرح أسئلة فضولية فقط." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Validation", content_en: "Partner B validates the vulnerability it took to share. Swap roles.", locale_ar: "التقدير", content_ar: "يقدر الشريك (ب) الجرأة في المشاركة. تبادلا الأدوار." }
			]
		},
		{
			slug: "tantric-breathing",
			type: ExerciseType.COUPLE,
			tier: SubscriptionTier.PREMIUM,
			status: ContentStatus.PUBLISHED,
			difficulty: Difficulty.ADVANCED,
			relationshipStage: RelationshipStage.ANY,
			durationMin: 15,
			title: "Tantric Breathing for Two",
			description: "Deep energy exchange using synchronized breath cycles.",
			coverImage: "/content/rhythmic_breathing.png",
			steps: [
				{ stepNumber: 1, type: StepType.TEXT_PROMPT, locale_en: "Position", content_en: "Sit in a relaxed spooning position, or facing each other closely.", locale_ar: "الوضعية", content_ar: "اجلسا في وضعية مريحة، أو متقابلين عن قرب." },
				{ stepNumber: 2, type: StepType.TEXT_PROMPT, locale_en: "Syncing", content_en: "Partner A inhales while Partner B exhales. Create a circular flow of breath.", locale_ar: "المزامنة", content_ar: "يأخذ الشريك (أ) شهيقاً بينما يقوم الشريك (ب) بالزفير. اخلقا تدفقاً دائرياً للتنفس." },
				{ stepNumber: 3, type: StepType.TEXT_PROMPT, locale_en: "Visualization", content_en: "Visualize energy passing between you with each breath exchange.", locale_ar: "التخيل", content_ar: "تخيلا الطاقة وهي تنتقل بينكما مع كل تبادل للأنفاس." }
			]
		}
	];

	for (const ex of exercises) {
		const existing = await prisma.exercise.findUnique({ where: { slug: ex.slug } });
		
		const createSteps = ex.steps.flatMap(s => [
			{ stepNumber: s.stepNumber, type: s.type, locale: "en", title: s.locale_en, instruction: s.content_en },
			{ stepNumber: s.stepNumber, type: s.type, locale: "ar", title: s.locale_ar, instruction: s.content_ar }
		]);

		if (existing) {
			console.log(`Updating exercise: ${ex.slug}`);
			await prisma.exerciseStep.deleteMany({ where: { exerciseId: existing.id } });
			
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
					coverImage: ex.coverImage,
					steps: {
						create: createSteps
					}
				}
			});
		} else {
			console.log(`Creating exercise: ${ex.slug}`);
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
					coverImage: ex.coverImage,
					steps: {
						create: createSteps
					}
				}
			});
		}
	}

	console.log("✅ Extended Seeding complete!");
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

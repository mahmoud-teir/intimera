import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDb } from '@/lib/__mocks__/db';

vi.mock('@/lib/db', () => ({ db: mockDb }));

// Mock next/cache so unstable_cache is a passthrough in tests
vi.mock('next/cache', () => ({
	unstable_cache: (fn: (...args: any[]) => any) => fn,
	revalidateTag: vi.fn(),
	revalidatePath: vi.fn(),
}));

// Import after mocking
const { getContentBySlug, listContentByCategory } = await import('@/lib/dal/content');
const { SubscriptionTier, ContentStatus } = await import('@/generated/prisma/client');

const MOCK_LOCALE = 'en';

const createMockContent = (overrides = {}) => ({
	id: 'content-1',
	slug: 'test-article',
	tier: SubscriptionTier.FREE,
	difficulty: 'BEGINNER',
	readingTimeMin: 5,
	publishedAt: new Date('2024-01-01'),
	status: ContentStatus.PUBLISHED,
	sortOrder: 0,
	relationshipStage: 'ANY',
	category: {
		id: 'cat-1',
		name: 'Communication',
		slug: 'communication',
		icon: '💬',
	},
	translations: [
		{
			title: 'Test Article',
			summary: 'A test summary.',
			body: 'Full body content.',
		}
	],
	...overrides,
});

describe('Content DAL', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getContentBySlug', () => {
		it('should return normalized content when found and published', async () => {
			const mockContent = createMockContent();
			// @ts-ignore - Mocking a subset
			mockDb.content.findUnique.mockResolvedValue(mockContent);

			const result = await getContentBySlug('test-article', MOCK_LOCALE);

			expect(result).not.toBeNull();
			expect(result?.slug).toBe('test-article');
			expect(result?.translation?.title).toBe('Test Article');
			expect(result?.isLocked).toBe(false);
			expect(mockDb.content.findUnique).toHaveBeenCalledTimes(1);
		});

		it('should return null if content is not found', async () => {
			mockDb.content.findUnique.mockResolvedValue(null);

			const result = await getContentBySlug('not-found', MOCK_LOCALE);

			expect(result).toBeNull();
		});

		it('should return null if content is not published', async () => {
			const mockContent = createMockContent({ status: ContentStatus.DRAFT });
			// @ts-ignore
			mockDb.content.findUnique.mockResolvedValue(mockContent);

			const result = await getContentBySlug('draft-article', MOCK_LOCALE);

			expect(result).toBeNull();
		});

		it('should lock body for FREE user accessing PREMIUM content', async () => {
			const mockContent = createMockContent({ tier: SubscriptionTier.PREMIUM });
			// @ts-ignore
			mockDb.content.findUnique.mockResolvedValue(mockContent);

			const result = await getContentBySlug('premium-article', MOCK_LOCALE, SubscriptionTier.FREE);

			expect(result?.isLocked).toBe(true);
			expect(result?.translation?.body).toBeUndefined();
		});

		it('should unlock body for PREMIUM user accessing PREMIUM content', async () => {
			const mockContent = createMockContent({ tier: SubscriptionTier.PREMIUM });
			// @ts-ignore
			mockDb.content.findUnique.mockResolvedValue(mockContent);

			const result = await getContentBySlug('premium-article', MOCK_LOCALE, SubscriptionTier.PREMIUM);

			expect(result?.isLocked).toBe(false);
			expect(result?.translation?.body).toBe('Full body content.');
		});
	});

	describe('listContentByCategory', () => {
		it('should return a list of normalized content items', async () => {
			const mockItems = [createMockContent(), createMockContent({ id: 'content-2', slug: 'test-2' })];
			// @ts-ignore
			mockDb.content.findMany.mockResolvedValue(mockItems);

			const result = await listContentByCategory('communication', MOCK_LOCALE);

			expect(result).toHaveLength(2);
			expect(result[0].slug).toBe('test-article');
			expect(mockDb.content.findMany).toHaveBeenCalledTimes(1);
		});

		it('should return an empty array when no content exists', async () => {
			mockDb.content.findMany.mockResolvedValue([]);

			const result = await listContentByCategory('empty-category', MOCK_LOCALE);

			expect(result).toHaveLength(0);
		});
	});
});

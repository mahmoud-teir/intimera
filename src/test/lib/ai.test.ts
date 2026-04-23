import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock both AI SDK and openai provider before imports
vi.mock('ai', () => ({
	generateObject: vi.fn(),
	generateText: vi.fn(),
	embed: vi.fn(),
	embedMany: vi.fn(),
}));

vi.mock('@ai-sdk/openai', () => ({
	openai: Object.assign(vi.fn(() => 'mocked-model'), {
		embedding: vi.fn(() => 'mocked-embedding-model'),
	}),
}));

vi.mock('@/lib/db', () => ({
	db: { $queryRaw: vi.fn() }
}));

// Import after mocking
const { buildAdvisorPrompt, moderateContent } = await import('@/lib/ai');
const aiModule = await import('ai');

describe('AI Lib', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('buildAdvisorPrompt', () => {
		it('should include fallback message when no context is provided', () => {
			const prompt = buildAdvisorPrompt([]);
			expect(prompt).toContain('No relevant library articles found');
			expect(prompt).toContain('You are the Intimera AI Relationship Advisor');
		});

		it('should include article title and summary in the prompt', () => {
			const contextItems = [
				{
					title: 'Communication 101',
					summary: 'Learn to talk to your partner.',
					body: 'Short body.'
				}
			];

			const prompt = buildAdvisorPrompt(contextItems);
			expect(prompt).toContain('Communication 101');
			expect(prompt).toContain('Learn to talk to your partner.');
		});

		it('should truncate long body content to a 500 char snippet', () => {
			const longBody = 'x'.repeat(1000);
			const contextItems = [{ title: 'Long Article', summary: 'Summary', body: longBody }];

			const prompt = buildAdvisorPrompt(contextItems);
			expect(prompt).toContain('...');
			// The snippet should not contain the full 1000 chars of 'x'
			expect(prompt.length).toBeLessThan(longBody.length + 500);
		});
	});

	describe('moderateContent', () => {
		it('should return APPROVED status when AI marks content as safe', async () => {
			vi.mocked(aiModule.generateObject).mockResolvedValue({
				object: { status: 'APPROVED', reason: 'Content is appropriate.' }
			} as any);

			const result = await moderateContent('I love my partner so much.');

			expect(result.status).toBe('APPROVED');
			expect(result.reason).toBe('Content is appropriate.');
			expect(aiModule.generateObject).toHaveBeenCalledTimes(1);
		});

		it('should return REJECTED status when AI flags content as harmful', async () => {
			vi.mocked(aiModule.generateObject).mockResolvedValue({
				object: { status: 'REJECTED', reason: 'Contains hate speech.' }
			} as any);

			const result = await moderateContent('Some hateful content.');

			expect(result.status).toBe('REJECTED');
		});

		it('should fallback to PENDING if AI throws an error', async () => {
			vi.mocked(aiModule.generateObject).mockRejectedValue(new Error('API Timeout'));

			const result = await moderateContent('Some text');

			expect(result.status).toBe('PENDING');
			expect(result.reason).toContain('failed');
		});
	});
});

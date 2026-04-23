import { z } from "zod";

export const contentQuerySchema = z.object({
	search: z.string().optional(),
	category: z.enum(["ARTICLE", "AUDIO", "EXERCISE", "ALL"]).optional().default("ALL"),
	tags: z.array(z.string()).optional(),
	sort: z.enum(["NEWEST", "POPULAR", "RELEVANT"]).optional().default("NEWEST"),
	page: z.number().int().min(1).optional().default(1),
	limit: z.number().int().min(1).max(50).optional().default(10),
});

export type ContentQueryInput = z.infer<typeof contentQuerySchema>;

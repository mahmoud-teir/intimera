import "dotenv/config";
import { defineConfig } from "prisma/config";

// ─────────────────────────────────────────────────────────────────────────────
// Prisma v7 Configuration
//
// In Prisma v7, url/directUrl are configured here in prisma.config.ts,
// NOT in schema.prisma (which only keeps provider + extensions).
//
// Neon requires TWO URLs:
//   DATABASE_URL  → pooler endpoint (pgBouncer, used at runtime)
//   DIRECT_URL    → direct endpoint (no pooler, required for `prisma migrate`)
//
// Both must be set in .env.local. Run `npx prisma migrate dev` normally.
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: process.env.DIRECT_URL!,   // direct (non-pooled) for migrations
	},
});

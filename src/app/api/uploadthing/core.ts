import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Role } from "@/generated/prisma/client";

const f = createUploadthing();

export const ourFileRouter = {
	// Cover image for content articles
	coverImage: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
	})
		.middleware(async () => {
			const session = await auth.api.getSession({
				headers: await headers(),
			});
			if (!session?.user) throw new UploadThingError("Unauthorized");

			const role = (session.user as any).role as Role;
			if (role !== Role.ADMIN && role !== Role.CONTENT_MANAGER) {
				throw new UploadThingError("Forbidden: Insufficient role");
			}

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return { uploadedBy: metadata.userId, url: file.ufsUrl };
		}),

	// Inline images for content body (markdown)
	contentImage: f({
		image: { maxFileSize: "8MB", maxFileCount: 1 },
	})
		.middleware(async () => {
			const session = await auth.api.getSession({
				headers: await headers(),
			});
			if (!session?.user) throw new UploadThingError("Unauthorized");

			const role = (session.user as any).role as Role;
			if (role !== Role.ADMIN && role !== Role.CONTENT_MANAGER) {
				throw new UploadThingError("Forbidden: Insufficient role");
			}

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return { uploadedBy: metadata.userId, url: file.ufsUrl };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

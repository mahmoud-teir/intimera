import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { exportUserData } from "@/actions/settings";

/**
 * GET /api/data/export
 * GDPR Art. 20 — Right to data portability.
 * Returns a JSON file download containing all user personal data.
 */
export async function GET() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const result = await exportUserData();

	if (!result.success || !result.data) {
		return NextResponse.json(
			{ error: result.error || "Export failed" },
			{ status: 500 }
		);
	}

	const filename = `intimera-data-export-${new Date().toISOString().split("T")[0]}.json`;
	const body = JSON.stringify(result.data, null, 2);

	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Content-Disposition": `attachment; filename="${filename}"`,
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff",
		},
	});
}

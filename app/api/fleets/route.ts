import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/prisma/db";
import { createFleetSchema, fleetsQuerySchema } from "@/lib/fleets/schema";
import type { FleetDTO, FleetsListResponse } from "@/lib/fleets/types";

export const dynamic = "force-dynamic";

function toDTO(row: {
	id: string;
	title: string;
	description: string | null;
	color: string;
	createdAt: string;
}): FleetDTO {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		color: row.color,
		// Postgres timestamptz text ("YYYY-MM-DD HH:MM:SS.ssssss+00") → ISO 8601
		createdAt: new Date(row.createdAt).toISOString(),
	};
}

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const parsed = fleetsQuerySchema.safeParse({
		limit: searchParams.get("limit") ?? undefined,
		cursor: searchParams.get("cursor") ?? undefined,
	});

	if (!parsed.success) {
		return NextResponse.json(
			{ errors: fieldErrors(parsed.error.issues) },
			{ status: 400 },
		);
	}

	const { limit, cursor } = parsed.data;

	// The cursor is a fleet id — resolve it to its sort position first.
	let anchor: { id: string; createdAt: string } | null = null;
	if (cursor) {
		const row = await db.orm.public.Fleet.select("id", "createdAt").first({
			id: cursor,
		});
		if (!row) {
			// Unknown cursor: nothing after it.
			const body: FleetsListResponse = { items: [], nextCursor: null };
			return NextResponse.json(body);
		}
		anchor = row;
	}

	const query = db.orm.public.Fleet.orderBy([
		(f) => f.createdAt.desc(),
		(f) => f.id.desc(),
	])
		.cursor(anchor ? { createdAt: anchor.createdAt, id: anchor.id } : {})
		.limit(limit);

	const rows = await query.all();

	const body: FleetsListResponse = {
		items: rows.map(toDTO),
		nextCursor:
			rows.length === limit ? (rows[rows.length - 1]!.id ?? null) : null,
	};

	return NextResponse.json(body);
}

/** POST /api/fleets — 201 with the created fleet, 400 with `{ errors }` on validation failure. */
export async function POST(request: NextRequest) {
	const raw: unknown = await request.json().catch(() => null);

	const parsed = createFleetSchema.safeParse(raw);
	if (!parsed.success) {
		return NextResponse.json(
			{ errors: fieldErrors(parsed.error.issues) },
			{ status: 400 },
		);
	}

	const { title, description, color } = parsed.data;

	const fleet = await db.orm.public.Fleet.create({
		title,
		description: description ?? null,
		color,
	});

	return NextResponse.json(toDTO(fleet), { status: 201 });
}

function fieldErrors(
	issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): Record<string, string> {
	const errors: Record<string, string> = {};
	for (const issue of issues) {
		const key = issue.path[0];
		if (typeof key === "string" && !(key in errors)) {
			errors[key] = issue.message;
		}
	}
	return errors;
}

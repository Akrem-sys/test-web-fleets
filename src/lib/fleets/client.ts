import { FLEETS_DEFAULT_LIMIT, type CreateFleetInput } from "./schema";
import type {
	FleetDTO,
	FleetsListResponse,
	FleetsValidationError,
} from "./types";

export type FleetFieldErrors = FleetsValidationError["errors"];

/** Thrown when POST /api/fleets responds 400 — carries per-field errors. */
export class FleetCreateError extends Error {
	readonly fieldErrors: FleetFieldErrors;

	constructor(
		fieldErrors: FleetFieldErrors,
		message = "Fleet creation failed server-side validation",
	) {
		super(message);
		this.name = "FleetCreateError";
		this.fieldErrors = fieldErrors;
	}
}

export interface FetchFleetsPageOptions {
	limit?: number;
	/** Fleet id anchor — the previous page's `nextCursor`. */
	cursor?: string;
	signal?: AbortSignal;
}

export async function fetchFleetsPage({
	limit = FLEETS_DEFAULT_LIMIT,
	cursor,
	signal,
}: FetchFleetsPageOptions): Promise<FleetsListResponse> {
	const params = new URLSearchParams({ limit: String(limit) });
	if (cursor) params.set("cursor", cursor);

	const response = await fetch(`/api/fleets?${params.toString()}`, { signal });

	if (!response.ok) {
		throw new Error(`GET /api/fleets failed with HTTP ${response.status}`);
	}

	return (await response.json()) as FleetsListResponse;
}

export interface CreateFleetValues {
	title: string;
	description?: string;
	color: string;
}

/** Creates a fleet via POST /api/fleets; rejects with `FleetCreateError` on 400. */
export async function createFleet(
	values: CreateFleetValues,
	signal?: AbortSignal,
): Promise<FleetDTO> {
	const description = values.description?.trim();
	const body: CreateFleetInput = {
		title: values.title.trim(),
		description: description ? description : undefined,
		// Palette-restricted server-side (zod enum); the cast just passes the raw form value through.
		color: values.color as CreateFleetInput["color"],
	};

	const response = await fetch("/api/fleets", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
		signal,
	});

	if (response.status === 400) {
		const payload = (await response.json().catch(() => null)) as
			| FleetsValidationError
			| null;
		throw new FleetCreateError(payload?.errors ?? {});
	}

	if (!response.ok) {
		throw new Error(`POST /api/fleets failed with HTTP ${response.status}`);
	}

	return (await response.json()) as FleetDTO;
}

/** Fleet DTO — `createdAt` is an ISO 8601 string. */
export interface FleetDTO {
	id: string;
	title: string;
	description: string | null;
	color: string;
	createdAt: string;
}

export interface FleetsListResponse {
	items: FleetDTO[];
	nextCursor: string | null;
}

export interface FleetsValidationError {
	errors: Partial<Record<"title" | "description" | "color", string>>;
}

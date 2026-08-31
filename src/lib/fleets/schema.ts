import { z } from "zod";

import { FLEET_COLORS } from "@/features/fleets/ui/lib/palette";

export interface CreateFleetSchemaMessages {
	titleRequired: string;
	titleTooLong: string;
	descriptionTooLong: string;
	colorInvalid: string;
}

/** Fixed rules, injected messages — server keeps English defaults, the client builds a locale-aware copy; color is restricted to the design palette. */
export const buildCreateFleetSchema = (messages: CreateFleetSchemaMessages) =>
	z.object({
		title: z
			.string()
			.trim()
			.min(1, messages.titleRequired)
			.max(100, messages.titleTooLong),
		description: z
			.string()
			.trim()
			.max(160, messages.descriptionTooLong)
			.optional(),
		color: z.enum(FLEET_COLORS, {
			error: messages.colorInvalid,
		}),
	});

export const createFleetSchema = buildCreateFleetSchema({
	titleRequired: "Title is required",
	titleTooLong: "Title must be 100 characters or fewer",
	descriptionTooLong: "Description must be 160 characters or fewer",
	colorInvalid: "Color must be one of the 8 design palette colors",
});

export type CreateFleetInput = z.infer<typeof createFleetSchema>;

export const fleetsQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(50).default(12),
	cursor: z.string().min(1).optional(),
});

export type FleetsQuery = z.infer<typeof fleetsQuerySchema>;

export const FLEETS_DEFAULT_LIMIT = 12;
export const FLEETS_MAX_LIMIT = 50;

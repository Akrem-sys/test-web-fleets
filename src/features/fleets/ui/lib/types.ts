import type { FleetDTO } from "@/lib/fleets/types";

/** Optional visual extras for a fleet card. */
export interface FleetCardVisuals {
	/** e.g. 128 — hidden when undefined. */
	companyCount?: number;
}

/** Values of the fleet creation form. */
export interface FleetFormValues {
	title: string;
	description: string;
	color: string;
}

/** Props contract of the fleets page (default export of ui/fleets-page.tsx). */
export interface FleetsPageProps {
	/** Fleets of the current page. */
	fleets: FleetDTO[];
	/** Infinite scroll: called when the sentinel enters the viewport. */
	onLoadMore?: () => void;
	/** Infinite scroll: whether a next page exists (sentinel stays inert otherwise). */
	hasNextPage?: boolean;
	/** Infinite scroll: shows the loading row below the grid. */
	isLoadingMore?: boolean;
	/** Creation form submit handler (modal closes on resolve). */
	onCreate?: (values: FleetFormValues) => void | Promise<void>;
	/** Shows a spinner on the submit button while the API call is in flight. */
	isCreating?: boolean;
	/** Optional per-fleet demo visuals (company count). */
	fleetVisuals?: (fleet: FleetDTO) => FleetCardVisuals | undefined;
}

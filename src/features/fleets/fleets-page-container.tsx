"use client";

import { useCallback, useEffect, useRef } from "react";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
	type InfiniteData,
} from "@tanstack/react-query";

import {
	createFleet,
	fetchFleetsPage,
	FleetCreateError,
} from "@/lib/fleets/client";
import { fleetKeys } from "@/lib/fleets/query-keys";
import { FLEETS_DEFAULT_LIMIT } from "@/lib/fleets/schema";
import type { FleetDTO, FleetsListResponse } from "@/lib/fleets/types";

import FleetsPage from "./ui/fleets-page";
import type { FleetCardVisuals, FleetFormValues } from "./ui/lib/types";
import { useFleetScrollThumb } from "./use-fleet-scroll-thumb";

const COMPANY_COUNT_MIN = 18;
const COMPANY_COUNT_MAX = 160;

// TODO: replace with real company relation count
const deriveCompanyCount = (fleetId: string): number => {
	let hash = 0;
	for (let i = 0; i < fleetId.length; i++) {
		hash = (hash * 31 + fleetId.charCodeAt(i)) | 0;
	}
	return (
		COMPANY_COUNT_MIN +
		(Math.abs(hash) % (COMPANY_COUNT_MAX - COMPANY_COUNT_MIN + 1))
	);
};

type FleetsInfiniteData = InfiniteData<FleetsListResponse, string | null>;

// The observer root must be the .fleets-scroll container, not the viewport — the sentinel sits inside the scroller's overflow clip.
const useFleetsSentinel = (onLoadMore: () => void, active: boolean) => {
	const onLoadMoreRef = useRef(onLoadMore);

	useEffect(() => {
		onLoadMoreRef.current = onLoadMore;
	}, [onLoadMore]);

	useEffect(() => {
		if (!active || typeof IntersectionObserver === "undefined") return;

		let observer: IntersectionObserver | null = null;
		let rafId = 0;
		let cancelled = false;
		// rAF retry guards first-paint/hydration races; capped at 120 frames so it can't spin forever.
		const MAX_ATTEMPTS = 120;
		let attempts = 0;

		const attach = () => {
			if (cancelled) return;

			// The scroller is static for the page's lifetime, so the observer never needs re-creating.
			const scroller = document.querySelector<HTMLElement>(".fleets-scroll");
			const sentinel = document.getElementById("fleets-sentinel");

			if (!scroller || !sentinel) {
				attempts += 1;
				if (attempts < MAX_ATTEMPTS) {
					rafId = requestAnimationFrame(attach);
				}
				return;
			}

			observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) {
						onLoadMoreRef.current();
					}
				},
				{
					root: scroller,
					rootMargin: "400px",
					threshold: 0,
				},
			);

			observer.observe(sentinel);
		};

		attach();

		return () => {
			cancelled = true;
			cancelAnimationFrame(rafId);
			observer?.disconnect();
		};
	}, [active]);
};

// Keeps the first page at FLEETS_DEFAULT_LIMIT; re-anchors the cursor so the pushed-off item returns with the next page.
const prependCreatedFleet = (
	created: FleetDTO,
	data: FleetsInfiniteData | undefined,
): FleetsInfiniteData => {
	if (!data || data.pages.length === 0) {
		return {
			pages: [{ items: [created], nextCursor: null }],
			pageParams: [null],
		};
	}

	const [firstPage, ...restPages] = data.pages;
	const items = [created, ...firstPage.items].slice(0, FLEETS_DEFAULT_LIMIT);
	const nextCursor =
		firstPage.nextCursor === null
			? null
			: (items[items.length - 1]?.id ?? firstPage.nextCursor);

	return {
		pages: [{ items, nextCursor }, ...restPages],
		pageParams: data.pageParams,
	};
};

const FleetsPageContainer = () => {
	const queryClient = useQueryClient();

	useFleetScrollThumb();

	const getFleetVisuals = useCallback(
		(fleet: FleetDTO): FleetCardVisuals => ({
			companyCount: deriveCompanyCount(fleet.id), // TODO: replace with real company relation count
		}),
		[],
	);

	const fleetsQuery = useInfiniteQuery({
		queryKey: fleetKeys.infinite(),
		queryFn: ({ pageParam, signal }) =>
			fetchFleetsPage({ cursor: pageParam ?? undefined, signal }),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const fleets =
		fleetsQuery.data?.pages.flatMap((page) => page.items) ?? [];

	const createFleetMutation = useMutation({
		mutationFn: (values: FleetFormValues) => createFleet(values),
		onSuccess: (created) => {
			queryClient.setQueryData<FleetsInfiniteData>(fleetKeys.infinite(), (data) =>
				prependCreatedFleet(created, data),
			);
		},
		onError: (error) => {
		if (error instanceof FleetCreateError) {
			// The modal has no error display yet — keep it open and log for the operator.
			console.warn("[fleets] creation rejected:", error.fieldErrors);
			}
		},
	});

	const { hasNextPage, isFetchingNextPage, fetchNextPage } = fleetsQuery;

	const handleLoadMore = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			void fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const handleCreate = useCallback(
		async (values: FleetFormValues) => {
			await createFleetMutation.mutateAsync(values);
		},
		[createFleetMutation],
	);

	useFleetsSentinel(handleLoadMore, fleetsQuery.hasNextPage);

	return (
		<FleetsPage
			fleets={fleets}
			onLoadMore={handleLoadMore}
			hasNextPage={fleetsQuery.hasNextPage}
			isLoadingMore={fleetsQuery.isFetchingNextPage}
			onCreate={handleCreate}
			isCreating={createFleetMutation.isPending}
			fleetVisuals={getFleetVisuals}
		/>
	);
};

export default FleetsPageContainer;

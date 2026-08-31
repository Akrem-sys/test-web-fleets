"use client";

import { useIntlayer } from "next-intlayer";
import { Button } from "@/components/button";
import { MODAL_IDS, useModalActions } from "@/components/modal";
import { FleetCard } from "./fleet-card";
import { FleetCreationModal } from "./fleet-creation-modal";
import { SparklesIcon } from "./icons";
import type { FleetsPageProps } from "./lib/types";

const FleetsPage = ({
	fleets,
	onLoadMore,
	hasNextPage = false,
	isLoadingMore = false,
	onCreate,
	isCreating = false,
	fleetVisuals,
}: FleetsPageProps) => {
	const content = useIntlayer("fleets");
	const { openModal } = useModalActions();
	const openCreation = () => openModal(MODAL_IDS["fleet-creation"]);

	return (
		<section className="flex h-screen w-full flex-col gap-4xl overflow-hidden pt-[55px]">
			<div className="flex w-full justify-end pr-xl">
				<Button
					type="button"
					variant="ghostMedium"
					textSize="base"
					className="rounded-xs px-s py-1"
					onClick={openCreation}
				>
					<SparklesIcon className="size-4" />
					{content.createButton}
				</Button>
			</div>

			{/* Scroll region; wrapper also anchors the fixed track line + thumb */}
			<div className="relative mt-[15px] ml-[161px] mr-[12px] h-[calc(100vh-204px)] max-w-[1725px]">
				<div className="fleets-scroll h-full w-full overflow-x-hidden overflow-y-auto pr-[17px]">
					{fleets.length > 0 && (
						<>
							{/* Fixed 320px tracks — deliberately asymmetric (no stretch/centering) */}
							<div className="grid w-full grid-cols-[repeat(auto-fill,320px)] gap-xl">
								{fleets.map((fleet) => (
									<FleetCard key={fleet.id} fleet={fleet} {...fleetVisuals?.(fleet)} />
								))}
							</div>

							{isLoadingMore && (
								<div role="status" className="flex w-full items-center justify-center gap-1.5 py-m">
									<span className="sr-only">{content.loadingMore}</span>
									<span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-white/40" />
									<span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-white/40 [animation-delay:150ms]" />
									<span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-white/40 [animation-delay:300ms]" />
								</div>
							)}
						</>
					)}

					{/* Infinite-scroll sentinel */}
					<div
						id="fleets-sentinel"
						aria-hidden="true"
						data-has-next-page={hasNextPage || undefined}
						data-on-load-more={onLoadMore ? "true" : undefined}
						className="h-px w-full"
					/>
				</div>

				{/* Custom scrollbar (native bar hidden via .fleets-scroll) */}

				{/* Track line, always visible */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-[5px] w-[2px] bg-[#46406F]"
				/>

				{/* Thumb — positioned via transform: translateY() only; hidden when content fits */}
				<div
					aria-hidden="true"
					data-fleet-scroll-thumb
					className="pointer-events-none absolute right-0 top-0 h-[61px] w-[12px] min-h-[44px]"
				>
					<div className="h-full w-full rounded-[10px] bg-[#241E42] p-px">
						<div className="h-full w-full rounded-[10px] bg-[#5C5494]" />
					</div>
				</div>
			</div>

			<FleetCreationModal onCreate={onCreate} isCreating={isCreating} />
		</section>
	);
};

export default FleetsPage;

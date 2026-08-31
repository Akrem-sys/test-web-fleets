"use client";

import { useIntlayer } from "next-intlayer";
import type { FleetDTO } from "@/lib/fleets/types";
import { cn } from "@/utils";
import { BuildingIcon } from "./icons";
import { fleetGlowBackground } from "./lib/palette";

export interface IFleetCardProps {
	fleet: FleetDTO;
	/** e.g. 128 — footer hidden when undefined. */
	companyCount?: number;
	className?: string;
}

export const FleetCard = ({ fleet, companyCount, className }: IFleetCardProps) => {
	const content = useIntlayer("fleets");

	const showCompanies = typeof companyCount === "number";

	return (
 		<article
			className={cn(
				// Deliberately flat: the glassmorphism utility's inset shadows darken the card.
				"group relative h-[280px] w-full min-w-0 overflow-hidden rounded-[10px] bg-black/30 backdrop-blur-md",
				"transition-transform duration-200 hover:-translate-y-0.5",
				className,
			)}
		>
			{/* Color glow derived from fleet.color */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{ background: fleetGlowBackground(fleet.color) }}
			/>

			{/* Glass rim — painted above the wash, below the content */}
			<div aria-hidden="true" className="glass-rim pointer-events-none absolute inset-0" />

			<div className="relative flex h-full flex-col px-xl pt-xl pb-2xl">
				<div className="flex w-full justify-end">
					<button
						type="button"
						aria-label={content.cardMenuAriaLabel}
						className="group/menu -m-1 flex cursor-pointer items-center gap-1 rounded-xs p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
					>
						<span className="size-1 rounded-full bg-white/30 transition-colors group-hover/menu:bg-white/70" />
						<span className="size-1 rounded-full bg-white/30 transition-colors group-hover/menu:bg-white/70" />
						<span className="size-1 rounded-full bg-white/30 transition-colors group-hover/menu:bg-white/70" />
					</button>
				</div>

				<h3 className="mt-[61px] line-clamp-2 h-12 w-full text-[20px] font-bold leading-6 text-white">
					{fleet.title}
				</h3>

				<p
					className={cn(
						"mt-m line-clamp-2 w-full text-[13px] leading-[18px]",
						fleet.description ? "text-white/60" : "text-white/30",
					)}
				>
					{fleet.description ?? content.emptyDescription}
				</p>

				{showCompanies && (
					<div className="mt-auto flex h-[22px] w-full items-center">
						<div className="flex min-w-0 items-center gap-[6px] text-[13px] leading-[18px] text-white">
							<BuildingIcon className="h-[10px] w-[9px] shrink-0" />
							<span className="min-w-0 truncate">
								<span className="font-medium">{companyCount}</span>{" "}
								<span className="font-light tracking-[0.02em] text-white/70">
									{content.companiesWord}
								</span>
							</span>
						</div>
					</div>
				)}
			</div>
		</article>
	);
};

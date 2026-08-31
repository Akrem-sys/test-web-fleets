"use client";

import { cn } from "@/utils";
import { FolderIcon } from "./icons";
import { fleetGlowBackground } from "./lib/palette";

export interface IFleetPreviewCardProps {
	/** Live title from the form (empty → placeholder). */
	title: string;
	/** Live description from the form (empty → placeholder). */
	description: string;
	/** Live selected color. */
	color: string;
	typeLabel: string;
	titlePlaceholder: string;
	descriptionPlaceholder: string;
}

/** Live preview of the fleet card shown in the creation overlay. */
export const FleetPreviewCard = ({
	title,
	description,
	color,
	typeLabel,
	titlePlaceholder,
	descriptionPlaceholder,
}: IFleetPreviewCardProps) => {
	return (
		<div className="relative h-[519px] w-full overflow-hidden rounded-[10px] bg-black/30 backdrop-blur-md">
			{/* Live color glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{ background: fleetGlowBackground(color) }}
			/>

			{/* Glass rim — painted above the wash, below the content */}
			<div aria-hidden="true" className="glass-rim pointer-events-none absolute inset-0" />

			<div className="relative flex h-full flex-col justify-between p-4xl pb-[64px]">
				{/* Type row */}
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-s text-[18px] text-white/50">
						<FolderIcon className="size-[22px]" />
						<span>{typeLabel}</span>
					</div>
					<div className="flex items-center gap-1.5" aria-hidden="true">
						<span className="size-[7px] rounded-full bg-white/30" />
						<span className="size-[7px] rounded-full bg-white/30" />
						<span className="size-[7px] rounded-full bg-white/30" />
					</div>
				</div>

				{/* Live infos */}
				<div className="flex w-full flex-col gap-xl">
					<h3
						className={cn(
							"line-clamp-2 text-[40px] font-bold leading-[48px]",
							title ? "text-white" : "text-white/40",
						)}
					>
						{title || titlePlaceholder}
					</h3>
					<p
						className={cn(
							"line-clamp-3 text-[22px] leading-[31px]",
							description ? "text-white/60" : "text-white/30",
						)}
					>
						{description || descriptionPlaceholder}
					</p>
				</div>

				{/* Bottom spacer for optical centering */}
				<div aria-hidden="true" className="h-1" />
			</div>
		</div>
	);
};

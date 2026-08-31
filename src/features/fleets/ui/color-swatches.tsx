"use client";

import { cn } from "@/utils";
import { FLEET_COLORS } from "./lib/palette";

export interface IColorSwatchesProps {
	value: string;
	onChange: (color: string) => void;
	ariaLabel: string;
	className?: string;
}

/** Radio group of color swatches; the selected one renders as an inner dot ringed by its own color. */
export const ColorSwatches = ({ value, onChange, ariaLabel, className }: IColorSwatchesProps) => {
	return (
		<div
			role="radiogroup"
			aria-label={ariaLabel}
			className={cn("flex flex-wrap items-center gap-[18px]", className)}
		>
			{FLEET_COLORS.map((color) => {
				const selected = color === value;
				return (
					<button
						key={color}
						type="button"
						role="radio"
						aria-checked={selected}
						aria-label={color}
						onClick={() => onChange(color)}
						className={cn(
							"flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full",
							"transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
							!selected && "hover:scale-110 active:scale-95",
						)}
					>
						{selected ? (
							<span
								aria-hidden="true"
								className="flex size-7 items-center justify-center rounded-full border-2"
								style={{ borderColor: color }}
							>
								<span className="size-[18px] rounded-full" style={{ backgroundColor: color }} />
							</span>
						) : (
							<span aria-hidden="true" className="size-7 rounded-full" style={{ backgroundColor: color }} />
						)}
					</button>
				);
			})}
		</div>
	);
};

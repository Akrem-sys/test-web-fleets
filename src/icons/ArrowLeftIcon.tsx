import type { SVGProps } from "react";

/** Inlines ./arrow-left.svg geometry — raw `.svg` imports aren't renderable components under Turbopack. */
export const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			focusable="false"
			viewBox="0 0 16 10"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M0.75 4.75H14.75M0.75 4.75L4.75 8.75M0.75 4.75L4.75 0.75"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};

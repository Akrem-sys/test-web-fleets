import type { SVGProps } from "react";

/** Sparkle used by the "Create a fleet" actions. */
export const SparklesIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M7.06 1.83a.5.5 0 0 1 .94 0l1.5 3.9a1 1 0 0 0 .58.57l3.9 1.5a.5.5 0 0 1 0 .94l-3.9 1.5a1 1 0 0 0-.58.58l-1.5 3.9a.5.5 0 0 1-.94 0l-1.5-3.9a1 1 0 0 0-.57-.58l-3.9-1.5a.5.5 0 0 1 0-.94l3.9-1.5a1 1 0 0 0 .57-.57l1.5-3.9Z" />
			<path d="M12.9 1.1a.35.35 0 0 1 .65 0l.4 1.03c.04.09.11.16.2.2l1.03.4a.35.35 0 0 1 0 .65l-1.03.4a.35.35 0 0 0-.2.2l-.4 1.03a.35.35 0 0 1-.65 0l-.4-1.03a.35.35 0 0 0-.2-.2l-1.03-.4a.35.35 0 0 1 0-.65l1.03-.4a.35.35 0 0 0 .2-.2l.4-1.03Z" />
		</svg>
	);
};

/** Filled folder used by the preview card "Type" label. */
export const FolderIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h4.02a2 2 0 0 1 1.52.7l1.32 1.55c.19.22.47.35.76.35h5.38A2.5 2.5 0 0 1 20 8.1v8.4a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 2 16.5v-11Z" />
		</svg>
	);
};

/** Small buildings used by the "{n} companies" card footer. */
export const BuildingIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg aria-hidden="true" fill="currentColor" fillRule="evenodd" clipRule="evenodd" focusable="false" viewBox="0 0 9 10" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M3 0H9V10H3V0ZM4.2 1.5h.8v.9h-.8V1.5ZM5.6 1.5h.8v.9h-.8V1.5ZM7 1.5h.8v.9H7V1.5ZM4.2 3h.8v.9h-.8V3ZM5.6 3h.8v.9h-.8V3ZM7 3h.8v.9H7V3ZM4.2 4.5h.8v.9h-.8v-.9ZM5.6 4.5h.8v.9h-.8v-.9ZM7 4.5h.8v.9H7v-.9ZM4.2 6h.8v.9h-.8V6ZM5.6 6h.8v.9h-.8V6ZM7 6h.8v.9H7V6ZM5.6 8h.8v2h-.8V8ZM0 10V4L3 3V10H0ZM1.1 4.4h.8v.9h-.8v-.9ZM1.1 5.8h.8v.9h-.8v-.9ZM1.1 8h.8v2h-.8V8Z" />
		</svg>
	);
};

/** Chevron separator of the breadcrumb. */
export const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="m7.5 4.5 5 5.5-5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
		</svg>
	);
};

/** Circled "i" used by the Help button. */
export const InfoIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
			<circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
			<path d="M10 9.2v4.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
			<circle cx="10" cy="6.4" r="1" fill="currentColor" />
		</svg>
	);
};

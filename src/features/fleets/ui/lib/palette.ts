/** Fleet color palette — array order is the display order of the swatch selector. */
export const FLEET_COLORS = [
	"#3E93E1", // blue
	"#7CD7F5", // sky
	"#5DC677", // green
	"#FAC863", // yellow
	"#F28029", // orange
	"#EB5555", // red
	"#E262DC", // pink
	"#AE32E3", // purple
] as const;

export type FleetColor = (typeof FLEET_COLORS)[number];

export const DEFAULT_FLEET_COLOR: FleetColor = FLEET_COLORS[0];

export const isFleetColor = (value: string): value is FleetColor =>
	(FLEET_COLORS as readonly string[]).includes(value);

/** Swatch → inner wash color: cards render these tints, not the raw swatch. */
const INNER_WASH_COLORS: Record<FleetColor, string> = {
	"#3E93E1": "#1379CD", // blue
	"#7CD7F5": "#55E7EC", // sky
	"#5DC677": "#13CD19", // green
	"#FAC863": "#CDB113", // yellow
	"#F28029": "#FD921F", // orange
	"#EB5555": "#CD1342", // red
	"#E262DC": "#F79CFF", // pink
	"#AE32E3": "#8C13CD", // purple
};

/** Inner wash color for a swatch; unknown values fall back to the default. */
export const getInnerColor = (swatch: string): string =>
	isFleetColor(swatch)
		? INNER_WASH_COLORS[swatch]
		: INNER_WASH_COLORS[DEFAULT_FLEET_COLOR];

const rgba = (hex: string, alpha: number): string =>
	`rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(
		hex.slice(5, 7),
		16,
	)}, ${alpha})`;

/** Radial wash from the card's top-left corner; last stop repeats the hue at alpha 0 so the fade never drifts through black. */
export const fleetGlowBackground = (color: string): string => {
	const inner = getInnerColor(color);
	const wash = rgba(inner, 0.3);
	return `radial-gradient(circle 240px at -4px -5px, ${wash} 0%, ${wash} 30%, ${rgba(
		inner,
		0,
	)} 100%)`;
};

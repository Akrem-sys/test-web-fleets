export const fleetKeys = {
	all: ["fleets"] as const,
	infinite: () => [...fleetKeys.all, "infinite"] as const,
};

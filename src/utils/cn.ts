import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["sx", "m", "l"] }] } },
});
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

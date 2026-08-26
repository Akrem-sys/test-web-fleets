import type { FC } from "react";

import { cn } from "@/utils";

import { Blob } from "./Blob";

type BackgroundTheme = "light" | "dark";

interface DynamicBackgroundProps {
  animated?: boolean;
  className?: string;
  theme?: BackgroundTheme;
}

export const DynamicBackground: FC<DynamicBackgroundProps> = ({
  animated = true,
  className,
  theme = "light",
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 size-full overflow-hidden",
        theme === "light" ? "bg-[#17132A]" : "bg-[#272149]",
        className,
      )}
    >
      {animated && <Blob />}
    </div>
  );
};

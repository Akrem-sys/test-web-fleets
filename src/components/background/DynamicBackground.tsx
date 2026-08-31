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
  theme = "dark",
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
      {/* Soft vertical lavender band, after the blobs */}
      <div className="absolute inset-y-0 left-[24.2%] w-[51.4%] bg-[linear-gradient(90deg,transparent_0%,rgba(140,130,197,0.12)_50%,transparent_100%)]" />
    </div>
  );
};

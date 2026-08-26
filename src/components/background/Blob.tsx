import type { FC } from "react";

import { cn } from "@/utils";

interface BlobProps {
  isAnimating?: boolean;
}

export const Blob: FC<BlobProps> = ({ isAnimating = true }) => {
  const animatedLayerClassName = cn(
    isAnimating && "animate-glob-slide will-change-transform",
  );

  return (
    <svg
      aria-hidden="true"
      className={cn(!isAnimating && "-ml-27 -mt-15")}
      fill="none"
      height={666}
      style={{ overflow: "visible" }}
      viewBox="0 0 426 666"
      width={426}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="background-blob-blur"
          filterUnits="userSpaceOnUse"
          height="800"
          width="800"
          x="-200"
          y="-200"
        >
          <feGaussianBlur stdDeviation={60} />
        </filter>
      </defs>

      <g filter="url(#background-blob-blur)" className={animatedLayerClassName}>
        <path
          d="M182.222 160.455C242.795 269.923 336.887 177.956 294.915 364.117C252.944 550.278 136.086 602.304 91.2529 476.811C46.4199 351.317 106.656 359.219 -21.4406 273.148C-149.538 187.077 121.649 50.9859 182.222 160.455Z"
          fill="#4B408C"
        />
      </g>

      <g
        className={animatedLayerClassName}
        filter="url(#background-blob-blur)"
        transform="translate(10 20)"
      >
        <path
          d="M188.139 153.345C237.65 242.821 314.558 167.65 280.252 319.813C245.946 471.976 150.429 514.5 113.784 411.925C77.1386 309.35 126.374 315.809 21.6714 245.457C-83.0315 175.105 138.629 63.8681 188.139 153.345Z"
          fill="#5E50AF"
        />
      </g>

      <g
        className={animatedLayerClassName}
        filter="url(#background-blob-blur)"
        transform="translate(30 40)"
      >
        <path
          d="M169.815 144.121C205.63 208.849 261.266 154.47 236.449 264.544C211.632 374.619 142.535 405.381 116.026 331.178C89.5169 256.976 125.134 261.648 49.3919 210.755C-26.35 159.863 133.999 79.3943 169.815 144.121Z"
          fill="#7E73BF"
        />
      </g>

      <g
        className={animatedLayerClassName}
        filter="url(#background-blob-blur)"
        transform="translate(45 55)"
      >
        <path
          d="M170.81 137.286C196.476 183.67 236.345 144.701 218.56 223.581C200.776 302.461 151.261 324.506 132.265 271.332C113.268 218.158 138.792 221.506 84.5144 185.036C30.2372 148.566 145.144 90.9017 170.81 137.286Z"
          fill="#9E96CF"
        />
      </g>

      <g
        className={animatedLayerClassName}
        filter="url(#background-blob-blur)"
        transform="translate(60 70)"
      >
        <path
          d="M127.852 141.039C159.091 197.496 207.618 150.065 185.972 246.075C164.326 342.084 104.058 368.915 80.9363 304.194C57.8145 239.473 88.8804 243.549 22.8166 199.159C-43.2471 154.769 96.6127 84.5828 127.852 141.039Z"
          fill="#E1C3FF"
        />
      </g>
    </svg>
  );
};

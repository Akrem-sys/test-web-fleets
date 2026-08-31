"use client";

import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "framer-motion";
import type * as React from "react";
import { cn } from "@/utils";

export interface ITiltCardProps {
	children: React.ReactNode;
	className?: string;
	/** Max rotation in degrees on each axis (subtle by design: ~8-12). */
	maxTilt?: number;
	/** Pointer-following highlight overlay. */
	glare?: boolean;
}

/** 3D tilt wrapper with optional glare; disabled under reduced motion. */
export const TiltCard = ({ children, className, maxTilt = 9, glare = true }: ITiltCardProps) => {
	const reduceMotion = useReducedMotion();

	const px = useMotionValue(0.5);
	const py = useMotionValue(0.5);
	const glareOpacity = useMotionValue(0);

	const spring = { stiffness: 180, damping: 24, mass: 0.7 };
	const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
	const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);
	const glareX = useSpring(useTransform(px, [0, 1], [8, 92]), spring);
	const glareY = useSpring(useTransform(py, [0, 1], [8, 92]), spring);
	const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12), transparent 65%)`;

	const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (event.pointerType === "touch") return;
		const rect = event.currentTarget.getBoundingClientRect();
		px.set((event.clientX - rect.left) / rect.width);
		py.set((event.clientY - rect.top) / rect.height);
		glareOpacity.set(1);
	};

	const handleLeave = () => {
		px.set(0.5);
		py.set(0.5);
		glareOpacity.set(0);
	};

	return (
		<div
			className={cn("[perspective:1100px]", className)}
			onPointerMove={reduceMotion ? undefined : handleMove}
			onPointerLeave={reduceMotion ? undefined : handleLeave}
		>
			<motion.div
				className="relative h-full w-full will-change-transform"
				style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
			>
				{children}
				{glare && !reduceMotion && (
					<motion.div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
						style={{ opacity: glareOpacity, background: glareBackground }}
					/>
				)}
			</motion.div>
		</div>
	);
};

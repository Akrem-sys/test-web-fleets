"use client";

import { motion } from "framer-motion";
import type * as React from "react";
import { cn } from "@/utils";
import { getContentVariants } from "../lib/animations";
import {
	type ModalPosition,
	type ModalSize,
	useModalStore,
} from "../lib/store/modal-store";

/**
 * Props for Modal.Content component
 */
export interface IModalContentProps {
	/** Custom className */
	className?: string;
	/** Custom className for the fixed positioning container */
	containerClassName?: string;
	/** Modal size preset */
	size?: ModalSize;
	/** Modal position */
	position?: ModalPosition;
	/** Custom width */
	width?: string;
	/** Custom max width */
	maxWidth?: string;
	/** Custom max height */
	maxHeight?: string;
	/** Enable scroll inside modal */
	scrollable?: boolean;
	/** Custom padding */
	padding?: string;
	/** Border radius */
	borderRadius?: string;
	/** Children components */
	children: React.ReactNode;
}

/**
 * Size presets mapping
 */
const sizeMap: Record<ModalSize, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	full: "max-w-full w-full h-full",
};

/**
 * Position presets mapping
 */
const positionMap: Record<ModalPosition, string> = {
	center: "items-center justify-center",
	top: "items-start justify-center pt-20",
	bottom: "items-end justify-center pb-20",
	left: "items-center justify-start pl-20",
	right: "items-center justify-end pr-20",
};

/**
 * Modal content component that contains the modal body
 *
 * @example
 * ```tsx
 * <Modal.Content size="lg" position="center" scrollable>
 *   <Modal.Header>Title</Modal.Header>
 *   <Modal.Body>Content</Modal.Body>
 * </Modal.Content>
 * ```
 */
export const ModalContent = ({
	className = "",
	containerClassName,
	size = "md",
	position = "center",
	width,
	maxWidth,
	maxHeight = "90vh",
	scrollable = true,
	padding = "1.5rem",
	borderRadius = "0.75rem",
	children,
}: IModalContentProps) => {
	const { animation } = useModalStore();
	const variants = getContentVariants(animation);

	const sizeClass = sizeMap[size];
	const positionClass = positionMap[position];

	return (
		<div
			className={cn(
				"pointer-events-none fixed inset-0 z-50 flex",
				positionClass,
				containerClassName,
			)}
		>
			<motion.div
				variants={variants}
				initial="hidden"
				animate="visible"
				exit="exit"
				onClick={(e) => e.stopPropagation()}
				className={cn(`pointer-events-auto no-scrollbar`, sizeClass, className)}
				style={{
					width: width || "100%",
					maxWidth: maxWidth || undefined,
					maxHeight,
					padding,
					borderRadius,
					overflow: scrollable ? "auto" : "hidden",
				}}
			>
				{children}
			</motion.div>
		</div>
	);
};

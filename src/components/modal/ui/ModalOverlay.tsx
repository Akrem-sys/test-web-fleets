"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils";
import { overlayVariants } from "../lib/animations";
import { useModalStore } from "../lib/store/modal-store";

/**
 * Props for Modal.Overlay component
 */
export interface IModalOverlayProps {
	/** Custom className */
	className?: string;
	/** Custom blur intensity (in pixels) */
	blurIntensity?: number;
	/** Background opacity (0-1) */
	opacity?: number;
	/** Custom background color */
	backgroundColor?: string;
	/** Custom click handler for nested overlays */
	onClick?: () => void;
}

/**
 * Modal overlay component that darkens the background
 *
 * @example
 * ```tsx
 * <Modal.Overlay blurIntensity={8} opacity={0.5} />
 * ```
 */
export const ModalOverlay = ({
	className = "",
	blurIntensity = 0,
	opacity = 0.5,
	backgroundColor = "rgb(0, 0, 0)",
	onClick,
}: IModalOverlayProps) => {
	const { closeModal, closeOnOverlayClick } = useModalStore();

	const handleClick = () => {
		if (onClick) {
			onClick();
			return;
		}
		if (closeOnOverlayClick) {
			closeModal();
		}
	};

	return (
		<>
			{/* Blur layer */}
			{blurIntensity > 0 && (
				<motion.div
					variants={overlayVariants}
					custom={1}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={cn("fixed inset-0 z-40", className)}
					onClick={handleClick}
					style={{
						backdropFilter: `blur(${blurIntensity}px)`,
						WebkitBackdropFilter: `blur(${blurIntensity}px)`,
					}}
				/>
			)}
			{/* Color overlay layer */}
			<motion.div
				variants={overlayVariants}
				custom={opacity}
				initial="hidden"
				animate="visible"
				exit="exit"
				onClick={handleClick}
				className={cn("fixed inset-0 z-40", className)}
				style={{
					backgroundColor,
				}}
			/>
		</>
	);
};

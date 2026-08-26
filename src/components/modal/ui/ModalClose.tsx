"use client";

import type * as React from "react";
import { Button } from "@/components/button";
import { CloseIcon } from "@/icons";
import { cn } from "@/utils";
import { useModalStore } from "../lib/store/modal-store";

/**
 * Props for Modal.Close component
 */
export interface IModalCloseProps {
	/** Custom className */
	className?: string;
	/** Custom icon */
	icon?: React.ReactNode;
	/** Optional visible label */
	label?: React.ReactNode;
	/** Accessible label */
	ariaLabel?: string;
	/** Custom close handler */
	onClick?: () => void;
	/** Custom button content */
	children?: React.ReactNode;
}

/**
 * Modal close button component
 *
 * @example
 * ```tsx
 * <Modal.Close ariaLabel="Close modal" />
 * ```
 */
export const ModalClose = ({
	className = "",
	icon,
	label,
	ariaLabel,
	onClick,
	children,
}: IModalCloseProps) => {
	const { closeModal } = useModalStore();
	const accessibleLabel =
		ariaLabel ?? (typeof label === "string" ? label : "Close modal");

	return (
		<Button
			variant="ghostMonochrome"
			size={label ? "fit" : "fit"}
			alignment="center"
			onClick={onClick ?? closeModal}
			aria-label={accessibleLabel}
			className={cn(
				"fixed top-11.75 right-14.25 z-70 flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white",
				className,
			)}
		>
			{icon === undefined ? (
				<CloseIcon className="size-2.5 text-current" />
			) : (
				icon
			)}
			{children ?? label}
		</Button>
	);
};

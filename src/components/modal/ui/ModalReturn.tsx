"use client";

import type * as React from "react";
import { Button, type IButtonProps } from "@/components/button";
import { ArrowLeftIcon } from "@/icons";
import { cn } from "@/utils";
import { useModalStore } from "../lib/store/modal-store";

export interface IModalReturnProps extends IButtonProps {
	children?: React.ReactNode;
	label?: string;
	onClick?: () => void;
	className?: string;
	defaultTextClassname?: string;
}

export const ModalReturn = ({
	children,
	label,
	onClick,
	className = "",
	defaultTextClassname,
	...buttonProps
}: IModalReturnProps) => {
	const { closeModal } = useModalStore();

	return (
		<Button
			{...buttonProps}
			variant="ghostMonochrome"
			className={cn(className, "fixed top-11.75 left-26 z-70 flex rounded-s")}
			onClick={onClick ?? closeModal}
		>
			{children && <>{children}</>}
			{!children && (
				<div className="flex items-center justify-center gap-s">
					<div className="size-6 flex items-center justify-center">
						<span className="w-3.5 h-1.5 flex items-center justify-center">
							<ArrowLeftIcon />
						</span>
					</div>
					<p
						className={cn("text-s font-normal leading-6", defaultTextClassname)}
					>
						{label}
					</p>
				</div>
			)}
		</Button>
	);
};

"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils";

const buttonVariants = cva(
	cn(
		"inline-flex items-center gap-2 cursor-pointer whitespace-nowrap",
		"rounded-md font-medium transition-all duration-200",
		"disabled:bg-white/50 disabled:text-white/40 disabled:cursor-not-allowed",
	),
	{
		variants: {
			variant: {
				ghostMonochrome: "text-white/60 hover:text-white",
				ghostLight: "text-primary hover:text-white",
				ghostMedium: "text-[#C1B9EA] hover:text-white",
				ghostDark: "text-primary-200 hover:text-white",
				primary: "bg-primary-400",
				danger:
					"rounded-sm bg-danger-100 px-4 py-3 font-normal text-danger transition-none hover:bg-danger-500 hover:text-white",
			},
			size: {
				fit: "w-fit h-fit",
				sm: "h-9 px-3",
				lg: "h-11 px-8",
				icon: "h-12 w-12",
			},
			padding: {
				default: "",
				sm: "px-2 py-1",
				lg: "px-3 py-2",
			},
			alignment: {
				default: "justify-start",
				center: "justify-center",
				end: "justify-end",
			},
			effect: {
				none: "",
				"3d": "transform-none shadow-inner",
			},
			textSize: {
				base: "text-base",
				sm: "text-[length:var(--text-sm)]",
				sx: "text-[length:var(--text-sx)]",
			},
		},
		defaultVariants: {
			variant: "ghostLight",
			size: "fit",
			padding: "default",
			alignment: "default",
			effect: "none",
			textSize: "sx",
		},
	},
);

export interface IButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
	(
		{
			className,
			variant,
			size,
			padding,
			alignment,
			textSize,
			effect,
			asChild = false,
			children,
			isLoading,
			disabled,
			...props
		},
		ref,
	) => {
		const classes = cn(
			buttonVariants({
				variant,
				size,
				padding,
				alignment,
				effect,
				className,
				textSize,
			}),
		);
		const isDisabled = isLoading || disabled;

		const buttonContent = asChild ? (
			<Slot
				className={cn(classes)}
				ref={ref}
				{...props}
				{...(isDisabled ? { "aria-disabled": true } : {})}
			>
				{children}
			</Slot>
		) : (
			<button className={classes} ref={ref} disabled={isDisabled} {...props}>
				{isLoading && <div className="h-4 w-4 animate-spin border-dotted" />}
				{children}
			</button>
		);

		return buttonContent;
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };

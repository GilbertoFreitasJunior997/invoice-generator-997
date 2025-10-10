import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { buttonVariants } from "./consts";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<"button"> &
	ButtonVariants & {
		asChild?: boolean;
	};

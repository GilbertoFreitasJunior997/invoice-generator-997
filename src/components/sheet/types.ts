import type * as SheetPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps, ReactNode } from "react";

export type SheetProps = ComponentProps<typeof SheetPrimitive.Root> & {
	className?: string;
	children?: ReactNode;
};

export type SheetTriggerProps = ComponentProps<
	typeof SheetPrimitive.Trigger
> & {
	className?: string;
	children?: ReactNode;
};

export type SheetCloseProps = ComponentProps<typeof SheetPrimitive.Close> & {
	className?: string;
	children?: ReactNode;
};

export type SheetPortalProps = ComponentProps<typeof SheetPrimitive.Portal> & {
	className?: string;
	children?: ReactNode;
};

export type SheetOverlayProps = ComponentProps<
	typeof SheetPrimitive.Overlay
> & {
	className?: string;
	children?: ReactNode;
};

export type SheetContentProps = ComponentProps<
	typeof SheetPrimitive.Content
> & {
	className?: string;
	children?: ReactNode;
	side?: "top" | "right" | "bottom" | "left";
};

export type SheetHeaderProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type SheetFooterProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type SheetTitleProps = ComponentProps<typeof SheetPrimitive.Title> & {
	className?: string;
	children?: ReactNode;
};

export type SheetDescriptionProps = ComponentProps<
	typeof SheetPrimitive.Description
> & {
	className?: string;
	children?: ReactNode;
};

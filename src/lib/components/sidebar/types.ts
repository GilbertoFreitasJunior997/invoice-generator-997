import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import type { Button } from "@/lib/components/button";
import type { Tooltip } from "@/lib/components/tooltip";
import type { sidebarMenuButtonVariants } from "./consts";

export type SidebarProviderProps = ComponentProps<"div"> & {
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
	children?: ReactNode;
};

export type SidebarProps = ComponentProps<"div"> & {
	side?: "left" | "right";
	variant?: "sidebar" | "floating" | "inset";
	collapsible?: "offcanvas" | "icon" | "none";
	className?: string;
	children?: ReactNode;
};

export type SidebarTriggerProps = ComponentProps<typeof Button> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarHeaderProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarFooterProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarContentProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarGroupProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarGroupContentProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarMenuProps = ComponentProps<"ul"> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarMenuItemProps = ComponentProps<"li"> & {
	className?: string;
	children?: ReactNode;
};

export type SidebarMenuButtonProps = ComponentProps<"button"> & {
	asChild?: boolean;
	isActive?: boolean;
	tooltip?: string | ComponentProps<typeof Tooltip.Content>;
	className?: string;
	children?: ReactNode;
} & VariantProps<typeof sidebarMenuButtonVariants>;

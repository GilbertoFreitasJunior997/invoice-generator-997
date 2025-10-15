import { Slot } from "@radix-ui/react-slot";
import { PanelLeftIcon } from "lucide-react";
import { type CSSProperties, useEffect } from "react";
import { Button } from "@/lib/components/button";
import { Sheet } from "@/lib/components/sheet";
import { Tooltip } from "@/lib/components/tooltip";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { useSidebar } from "@/lib/stores/sidebar.store";
import { cn } from "@/lib/utils/cn";
import {
	SIDEBAR_KEYBOARD_SHORTCUT,
	SIDEBAR_WIDTH,
	SIDEBAR_WIDTH_ICON,
	SIDEBAR_WIDTH_MOBILE,
	sidebarMenuButtonVariants,
} from "./consts";
import type {
	SidebarContentProps,
	SidebarFooterProps,
	SidebarGroupContentProps,
	SidebarGroupProps,
	SidebarHeaderProps,
	SidebarMenuButtonProps,
	SidebarMenuItemProps,
	SidebarMenuProps,
	SidebarProps,
	SidebarProviderProps,
	SidebarTriggerProps,
} from "./types";
import { useSidebarState } from "./utils";

const Provider = ({
	defaultOpen = true,
	open: openProp,
	onOpenChange: setOpenProp,
	className,
	style,
	children,
	...props
}: SidebarProviderProps) => {
	const toggleSidebar = useSidebar((s) => s.toggleSidebar);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
				(event.metaKey || event.ctrlKey)
			) {
				event.preventDefault();
				toggleSidebar();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);

	return (
		<Tooltip.Provider delayDuration={0}>
			<div
				data-slot="sidebar-wrapper"
				style={
					{
						"--sidebar-width": SIDEBAR_WIDTH,
						"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
						...style,
					} as CSSProperties
				}
				className={cn(
					"group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</Tooltip.Provider>
	);
};

const Root = ({
	side = "left",
	variant = "sidebar",
	collapsible = "offcanvas",
	className,
	children,
	...props
}: SidebarProps) => {
	const isMobile = useIsMobile();
	const state = useSidebarState();
	const isOpenMobile = useSidebar((s) => s.isOpenMobile);
	const setIsOpenMobile = useSidebar((s) => s.setIsOpenMobile);

	if (collapsible === "none") {
		return (
			<div
				data-slot="sidebar"
				className={cn(
					"bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	}

	if (isMobile) {
		return (
			<Sheet.Root open={isOpenMobile} onOpenChange={setIsOpenMobile} {...props}>
				<Sheet.Content
					data-sidebar="sidebar"
					data-slot="sidebar"
					data-mobile="true"
					className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
					style={
						{
							"--sidebar-width": SIDEBAR_WIDTH_MOBILE,
						} as CSSProperties
					}
					side={side}
				>
					<Sheet.Header className="sr-only">
						<Sheet.Title>Sidebar</Sheet.Title>
						<Sheet.Description>Displays the mobile sidebar.</Sheet.Description>
					</Sheet.Header>
					<div className="flex h-full w-full flex-col">{children}</div>
				</Sheet.Content>
			</Sheet.Root>
		);
	}

	return (
		<div
			className="group peer text-sidebar-foreground hidden md:block"
			data-state={state}
			data-collapsible={state === "collapsed" ? collapsible : ""}
			data-variant={variant}
			data-side={side}
			data-slot="sidebar"
		>
			<div
				data-slot="sidebar-gap"
				className={cn(
					"relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
					"group-data-[collapsible=offcanvas]:w-0",
					"group-data-[side=right]:rotate-180",
					variant === "floating" || variant === "inset"
						? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
						: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
				)}
			/>
			<div
				data-slot="sidebar-container"
				className={cn(
					"fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
					side === "left"
						? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
						: "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
					variant === "floating" || variant === "inset"
						? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
						: "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
					className,
				)}
				{...props}
			>
				<div
					data-sidebar="sidebar"
					data-slot="sidebar-inner"
					className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
				>
					{children}
				</div>
			</div>
		</div>
	);
};

const Trigger = ({ className, onClick, ...props }: SidebarTriggerProps) => {
	const toggleSidebar = useSidebar((s) => s.toggleSidebar);

	return (
		<Button
			data-sidebar="trigger"
			data-slot="sidebar-trigger"
			variant="ghost"
			size="icon"
			className={cn("size-7", className)}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...props}
		>
			<PanelLeftIcon />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
};

const Header = ({ className, ...props }: SidebarHeaderProps) => {
	return (
		<div
			data-slot="sidebar-header"
			data-sidebar="header"
			className={cn("flex flex-col gap-2 p-2", className)}
			{...props}
		/>
	);
};

const Footer = ({ className, ...props }: SidebarFooterProps) => {
	return (
		<div
			data-slot="sidebar-footer"
			data-sidebar="footer"
			className={cn("flex flex-col gap-2 p-2", className)}
			{...props}
		/>
	);
};

const Content = ({ className, ...props }: SidebarContentProps) => {
	return (
		<div
			data-slot="sidebar-content"
			data-sidebar="content"
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden text-foreground",
				className,
			)}
			{...props}
		/>
	);
};

const Group = ({ className, ...props }: SidebarGroupProps) => {
	return (
		<div
			data-slot="sidebar-group"
			data-sidebar="group"
			className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
			{...props}
		/>
	);
};

const GroupContent = ({ className, ...props }: SidebarGroupContentProps) => {
	return (
		<div
			data-slot="sidebar-group-content"
			data-sidebar="group-content"
			className={cn("w-full text-sm", className)}
			{...props}
		/>
	);
};

const Menu = ({ className, ...props }: SidebarMenuProps) => {
	return (
		<ul
			data-slot="sidebar-menu"
			data-sidebar="menu"
			className={cn("flex w-full min-w-0 flex-col gap-1", className)}
			{...props}
		/>
	);
};

const MenuItem = ({ className, ...props }: SidebarMenuItemProps) => {
	return (
		<li
			data-slot="sidebar-menu-item"
			data-sidebar="menu-item"
			className={cn("group/menu-item relative", className)}
			{...props}
		/>
	);
};

const MenuButton = ({
	asChild = false,
	isActive = false,
	variant = "default",
	size = "default",
	tooltip,
	className,
	...props
}: SidebarMenuButtonProps) => {
	const Comp = asChild ? Slot : "button";
	const isMobile = useIsMobile();
	const state = useSidebarState();

	const button = (
		<Comp
			data-slot="sidebar-menu-button"
			data-sidebar="menu-button"
			data-size={size}
			data-active={isActive}
			className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
			{...props}
		/>
	);

	if (!tooltip) {
		return button;
	}

	if (typeof tooltip === "string") {
		tooltip = {
			children: tooltip,
		};
	}

	return (
		<Tooltip.Root>
			<Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
			<Tooltip.Content
				side="right"
				align="center"
				hidden={state !== "collapsed" || isMobile}
				{...tooltip}
			/>
		</Tooltip.Root>
	);
};

export const Sidebar = {
	Provider,
	Root,
	Trigger,
	Header,
	Footer,
	Content,
	Group,
	GroupContent,
	Menu,
	MenuItem,
	MenuButton,
};

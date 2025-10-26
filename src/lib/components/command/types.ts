import type { Command as CommandPrimitive } from "cmdk";
import type { ComponentProps, ReactNode } from "react";
import type { DialogRootProps } from "../dialog";

export type CommandRootProps = ComponentProps<typeof CommandPrimitive>;

export type CommandDialogProps = DialogRootProps & {
	title?: string;
	description?: string;
	children?: ReactNode;
	className?: string;
	showCloseButton?: boolean;
};

export type CommandInputProps = ComponentProps<typeof CommandPrimitive.Input>;

export type CommandListProps = ComponentProps<typeof CommandPrimitive.List>;

export type CommandEmptyProps = ComponentProps<typeof CommandPrimitive.Empty>;

export type CommandGroupProps = ComponentProps<typeof CommandPrimitive.Group>;

export type CommandSeparatorProps = ComponentProps<
	typeof CommandPrimitive.Separator
>;

export type CommandItemProps = ComponentProps<typeof CommandPrimitive.Item>;

export type CommandShortcutProps = ComponentProps<"span">;

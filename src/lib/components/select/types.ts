import type * as SelectPrimitive from "@radix-ui/react-select";
import type { ComponentProps } from "react";

export type SelectRootProps = ComponentProps<typeof SelectPrimitive.Root>;

export type SelectGroupProps = ComponentProps<typeof SelectPrimitive.Group>;

export type SelectTriggerProps = ComponentProps<
	typeof SelectPrimitive.Trigger
> & {
	size?: "sm" | "default";
};

export type SelectContentProps = ComponentProps<
	typeof SelectPrimitive.Content
> & {
	position?: "popper" | "fixed";
	align?: "start" | "center" | "end";
};

export type SelectLabelProps = ComponentProps<typeof SelectPrimitive.Label>;

export type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>;

export type SelectSeparatorProps = ComponentProps<
	typeof SelectPrimitive.Separator
>;

export type SelectScrollUpButtonProps = ComponentProps<
	typeof SelectPrimitive.ScrollUpButton
>;

export type SelectScrollDownButtonProps = ComponentProps<
	typeof SelectPrimitive.ScrollDownButton
>;

export type SelectValueProps = ComponentProps<typeof SelectPrimitive.Value>;

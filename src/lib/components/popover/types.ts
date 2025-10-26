import type * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentProps } from "react";

export type PopoverRootProps = ComponentProps<typeof PopoverPrimitive.Root>;

export type PopoverTriggerProps = ComponentProps<
	typeof PopoverPrimitive.Trigger
>;

export type PopoverContentProps = ComponentProps<
	typeof PopoverPrimitive.Content
>;

export type PopoverAnchorProps = ComponentProps<typeof PopoverPrimitive.Anchor>;

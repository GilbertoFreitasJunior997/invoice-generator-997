import type * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";

export type AvatarRootProps = ComponentProps<typeof AvatarPrimitive.Root>;
export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;
export type AvatarFallbackProps = ComponentProps<
	typeof AvatarPrimitive.Fallback
>;

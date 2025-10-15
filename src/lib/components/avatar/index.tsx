import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils/cn";
import type {
	AvatarFallbackProps,
	AvatarImageProps,
	AvatarRootProps,
} from "./types";

const Root = ({ className, ...props }: AvatarRootProps) => {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			className={cn(
				"relative flex size-8 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...props}
		/>
	);
};

const Image = ({ className, ...props }: AvatarImageProps) => {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn("aspect-square size-full", className)}
			{...props}
		/>
	);
};

const Fallback = ({ className, ...props }: AvatarFallbackProps) => {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"bg-muted flex size-full items-center justify-center rounded-full",
				className,
			)}
			{...props}
		/>
	);
};

export const Avatar = {
	Root,
	Image,
	Fallback,
};

import { cn } from "@/lib/utils/cn";
import type { SkeletonProps } from "./types";

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
	return (
		<div
			data-slot="skeleton"
			className={cn("bg-accent animate-pulse rounded-md", className)}
			{...props}
		/>
	);
};

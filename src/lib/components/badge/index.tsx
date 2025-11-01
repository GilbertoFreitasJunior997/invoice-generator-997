import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";
import { badgeVariants } from "./const";
import type { BadgeProps } from "./types";

export const Badge = ({
	className,
	variant,
	isGhost,
	asChild = false,
	...props
}: BadgeProps) => {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant, isGhost }), className)}
			{...props}
		/>
	);
};

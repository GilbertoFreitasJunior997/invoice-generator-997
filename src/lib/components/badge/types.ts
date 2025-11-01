import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "./const";

export type BadgeProps = React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean };

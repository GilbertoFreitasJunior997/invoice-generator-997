import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";
import { buttonVariants } from "./consts";
import type { ButtonProps } from "./types";

export const Button = ({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ButtonProps) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			type="button"
			{...props}
		/>
	);
};

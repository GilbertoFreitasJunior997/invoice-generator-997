import { cva } from "class-variance-authority";

export const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				primary: "bg-primary text-primary-foreground",
				secondary: "bg-secondary text-secondary-foreground",
				destructive:
					"bg-destructive text-white focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			},
			isGhost: {
				true: "",
				false: "border-transparent text-foreground",
			},
		},
		compoundVariants: [
			{
				variant: "primary",
				isGhost: true,
				class: "border-primary/70 bg-primary/10 text-primary",
			},
			{
				variant: "secondary",
				isGhost: true,
				class: "border-secondary/60 bg-secondary/10 text-secondary",
			},
			{
				variant: "destructive",
				isGhost: true,
				class: "border-destructive/60 bg-destructive/10 text-destructive",
			},
		],
		defaultVariants: {
			variant: "primary",
			isGhost: false,
		},
	},
);

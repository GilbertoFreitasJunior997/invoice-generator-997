import { cva } from "class-variance-authority";

export const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				primary: "bg-primary text-primary-foreground",
				secondary: "border-muted bg-muted text-foreground/80",
				warning:
					"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
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
				class:
					"border border-muted-foreground/20 dark:border-secondary bg-muted dark:bg-secondary/40 text-foreground/80",
			},
			{
				variant: "warning",
				isGhost: true,
				class: "border-yellow-400 dark:border-yellow-900",
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

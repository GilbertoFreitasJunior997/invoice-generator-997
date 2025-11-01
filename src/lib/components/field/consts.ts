import { cn } from "@/lib/utils/cn";

export const inputBorderStateClassNames = cn(
	"border",
	"focus-visible:border-ring",
	"aria-invalid:border-destructive",
);

export const inputBoxSizeClassNames = cn(
	"min-h-9 h-9 min-w-0 w-full px-3 py-1",
	"rounded-md shadow-xs transition-[box-shadow]",
);

export const inputBoxClassNames = cn(
	inputBorderStateClassNames,
	"text-sm",
	inputBoxSizeClassNames,
	"dark:bg-input/30 bg-transparent outline-none",
	"placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
	"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
);

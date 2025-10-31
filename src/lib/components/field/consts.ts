import { cn } from "@/lib/utils/cn";

export const inputBorderStateClassNames = cn(
	"border",
	"focus-visible:border-ring",
	"aria-invalid:border-destructive",
);

export const inputBoxClassNames = cn(
	inputBorderStateClassNames,
	"text-sm",
	"min-h-9 h-9 min-w-0 w-full px-3 py-1",
	"dark:bg-input/30 rounded-md bg-transparent shadow-xs transition-[box-shadow] outline-none",
	"placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
	"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
);

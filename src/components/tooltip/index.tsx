import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/cn";
import type {
	TooltipContentProps,
	TooltipProviderProps,
	TooltipRootProps,
	TooltipTriggerProps,
} from "./types";

const Provider = ({ delayDuration = 0, ...props }: TooltipProviderProps) => {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
};

const Root = (props: TooltipRootProps) => {
	return (
		<Provider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</Provider>
	);
};

const Trigger = (props: TooltipTriggerProps) => {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
};

const Content = ({
	className,
	sideOffset = 0,
	children,
	...props
}: TooltipContentProps) => {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cn(
					"bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
					className,
				)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
};

export const Tooltip = {
	Provider,
	Root,
	Trigger,
	Content,
};

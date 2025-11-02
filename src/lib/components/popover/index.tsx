import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils/cn";
import type {
	PopoverAnchorProps,
	PopoverContentProps,
	PopoverRootProps,
	PopoverTriggerProps,
} from "./types";

export const Root = ({ ...props }: PopoverRootProps) => {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />;
};

export const Trigger = ({ ...props }: PopoverTriggerProps) => {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
};

export const Content = ({
	className,
	align = "center",
	sideOffset = 4,
	...props
}: PopoverContentProps) => {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				data-slot="popover-content"
				align={align}
				sideOffset={sideOffset}
				className={cn(
					"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
					"w-(--radix-popover-trigger-width)",
					className,
				)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	);
};

const Anchor = ({ ...props }: PopoverAnchorProps) => {
	return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
};

export const Popover = {
	Root,
	Trigger,
	Content,
	Anchor,
};

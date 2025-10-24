import { cn } from "@/lib/utils/cn";
import { useFormContext } from "@/lib/utils/forms.utils";
import { Button } from "../button";
import type { SubmitButtonProps } from "./types";

export const SubmitButton = ({
	label,
	className,
	buttonProps: buttonPropsProp,
	isDisabled,
}: SubmitButtonProps) => {
	const form = useFormContext();

	const {
		className: buttonPropsClassName,
		disabled,
		...buttonProps
	} = buttonPropsProp ?? {};

	return (
		<form.Subscribe
			selector={(state) => [
				state.isSubmitting,
				state.isDefaultValue,
				state.canSubmit,
			]}
			children={([isSubmitting, isDefaultValue, canSubmit]) => (
				<Button
					type="submit"
					{...buttonProps}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();

						buttonProps?.onClick?.(event);
					}}
					disabled={
						isSubmitting ||
						disabled ||
						isDisabled ||
						isDefaultValue ||
						!canSubmit
					}
					className={cn(className, buttonPropsClassName)}
				>
					{label ?? "Submit"}
				</Button>
			)}
		/>
	);
};

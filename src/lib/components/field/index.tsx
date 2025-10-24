import { useMemo } from "react";
import { Label as LabelComponent } from "@/lib/components/label";
import { cn } from "@/lib/utils/cn";
import { fieldVariants } from "./consts";
import type {
	FieldDescriptionProps,
	FieldErrorProps,
	FieldLabelProps,
	FieldRootProps,
} from "./types";

const Root = ({
	className,
	orientation = "vertical",
	...props
}: FieldRootProps) => {
	return (
		<fieldset
			data-slot="field"
			data-orientation={orientation}
			className={cn(fieldVariants({ orientation }), className)}
			{...props}
		/>
	);
};

const Label = ({ className, ...props }: FieldLabelProps) => {
	return (
		<LabelComponent
			data-slot="field-label"
			className={cn(
				"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
				"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
				"has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
				className,
			)}
			{...props}
		/>
	);
};

const getErrorMessage = (error: { message?: string } | string | undefined) => {
	if (typeof error === "string") {
		return error;
	}

	return error?.message ?? undefined;
};

// named "FieldError" to avoid shadowing the global "Error" property
const FieldError = ({
	className,
	children,
	errors,
	...props
}: FieldErrorProps) => {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors) {
			return null;
		}

		const firstError = getErrorMessage(errors[0]);
		if (errors.length === 1 && firstError) {
			return firstError;
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{errors.map((error) => {
					const errorMessage = getErrorMessage(error);

					if (!errorMessage) {
						return null;
					}

					return <li key={errorMessage}>{errorMessage}</li>;
				})}
			</ul>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn("text-destructive text-sm font-normal", className)}
			{...props}
		>
			{content}
		</div>
	);
};

const Description = ({ className, ...props }: FieldDescriptionProps) => {
	return (
		<p
			data-slot="field-description"
			className={cn(
				"text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
				"last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
				"[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
				className,
			)}
			{...props}
		/>
	);
};

export const Field = {
	Root,
	Label,
	Error: FieldError,
	Description,
};

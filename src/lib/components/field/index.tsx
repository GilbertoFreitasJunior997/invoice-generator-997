import * as LabelPrimitive from "@radix-ui/react-label";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { inputBoxSizeClassNames } from "./consts";
import type {
	FieldDescriptionProps,
	FieldErrorProps,
	FieldLabelProps,
	FieldRootProps,
} from "./types";

const Root = ({ className, children }: FieldRootProps) => {
	return (
		<fieldset
			data-slot="field"
			className={cn(
				"group/field flex w-full gap-1.5 data-[invalid=true]:text-destructive min-w-[unset] overflow-clip flex-col *:w-full [&>.sr-only]:w-auto",
				className,
			)}
		>
			{children}
		</fieldset>
	);
};

const Label = ({ className, label, isRequired, ...props }: FieldLabelProps) => {
	if (!label) {
		return null;
	}

	return (
		<LabelPrimitive.Root
			data-slot="field-label"
			className={cn(
				"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
				"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-4",
				"has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
				className,
			)}
			{...props}
		>
			<span className="flex items-center gap-0.5">
				{label}
				{isRequired && <span className="text-destructive">*</span>}
			</span>
		</LabelPrimitive.Root>
	);
};

// named "FieldError" to avoid shadowing the global "Error" property
const FieldError = ({ errors, className }: FieldErrorProps) => {
	if (!errors?.length) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn("text-destructive text-sm font-normal", className)}
		>
			{errors.length === 1 ? (
				<span>{errors[0]}</span>
			) : (
				<ul className="ml-4 flex list-disc flex-col gap-1">
					{errors.map((error) => {
						return <li key={error}>{error}</li>;
					})}
				</ul>
			)}
		</div>
	);
};

const Description = ({ description, className }: FieldDescriptionProps) => {
	if (!description) {
		return null;
	}

	return (
		<p
			data-slot="field-description"
			className={cn(
				"text-muted-foreground text-sm leading-normal font-normal",
				className,
			)}
		>
			{description}
		</p>
	);
};

type LoadingContainerProps = {
	children: ReactNode;
	isLoading?: boolean;
	className?: string;
};
const LoadingContainer = ({
	children,
	isLoading,
	className,
}: LoadingContainerProps) => {
	if (!isLoading) {
		return children;
	}

	return (
		<div
			className={cn(
				inputBoxSizeClassNames,
				"relative",
				"bg-input/60 animate-pulse",
				className,
			)}
		/>
	);
};

export const Field = {
	Root,
	Label,
	Error: FieldError,
	Description,
	LoadingContainer,
};

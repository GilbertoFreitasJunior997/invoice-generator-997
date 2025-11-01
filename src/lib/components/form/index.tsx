import type { FormEvent } from "react";
import { Separator as SeparatorComponent } from "@/lib/components/separator";
import { cn } from "@/lib/utils/cn";
import { useFormContext } from "@/lib/utils/forms.utils";
import { Button } from "../button";
import type { ButtonProps } from "../button/types";
import { FormRootProvider } from "./providers";
import type {
	FormGroupProps,
	FormLegendProps,
	FormRootProps,
	FormSeparatorProps,
} from "./types";

export const FormRoot = ({
	form,
	className,
	children,
	isLoading,
}: FormRootProps) => {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<form.AppForm>
			<FormRootProvider isLoading={isLoading}>
				<form onSubmit={handleSubmit} className={className}>
					{children}
				</form>
			</FormRootProvider>
		</form.AppForm>
	);
};

export const FormGroup = ({ className, ...props }: FormGroupProps) => {
	return (
		<div
			data-slot="field-group"
			className={cn(
				"group/field-group @container/field-group flex w-full flex-col gap-4 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
				className,
			)}
			{...props}
		/>
	);
};

export const FormLegend = ({
	className,
	variant = "legend",
	...props
}: FormLegendProps) => {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(
				"-mb-1 font-medium",
				"data-[variant=legend]:text-base",
				"data-[variant=label]:text-sm",
				className,
			)}
			{...props}
		/>
	);
};

export const FormSeparator = ({
	children,
	className,
	...props
}: FormSeparatorProps) => {
	return (
		<div
			data-slot="field-separator"
			data-content={!!children}
			className={cn(
				"relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 w-full col-span-full",
				className,
			)}
			{...props}
		>
			<SeparatorComponent className="absolute inset-0 top-1/2" />
			{children && (
				<span
					className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
					data-slot="field-separator-content"
				>
					{children}
				</span>
			)}
		</div>
	);
};

export const FormSubmitButton = (props: ButtonProps) => {
	const form = useFormContext();

	return (
		<form.Subscribe
			selector={(state) => ({
				isSubmitting: state.isSubmitting,
				isDefaultValue: state.isDefaultValue,
				canSubmit: state.canSubmit,
			})}
			children={({ isSubmitting, isDefaultValue, canSubmit }) => (
				<Button
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						void form.handleSubmit();
					}}
					{...props}
					disabled={
						isSubmitting || props.disabled || isDefaultValue || !canSubmit
					}
				>
					{props.children ?? "Submit"}
				</Button>
			)}
		/>
	);
};

import type { ComponentProps, FormEvent } from "react";
import { Separator as SeparatorComponent } from "@/lib/components/separator";
import { cn } from "@/lib/utils/cn";
import type {
	FormGroupProps,
	FormLegendProps,
	FormRootProps,
	FormSeparatorProps,
	FormSetProps,
} from "./types";

const BaseRootForm = (props: ComponentProps<"form">) => {
	return <form data-slot="form" {...props} />;
};

const Root = ({ form, onSubmit, ...props }: FormRootProps) => {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();

		onSubmit?.(event);
	};

	if (form) {
		return (
			<form.AppForm>
				<BaseRootForm onSubmit={handleSubmit} {...props} />
			</form.AppForm>
		);
	}

	return <BaseRootForm onSubmit={handleSubmit} {...props} />;
};

const Group = ({ className, ...props }: FormGroupProps) => {
	return (
		<div
			data-slot="field-group"
			className={cn(
				"group/field-group @container/field-group flex w-full flex-col gap-4 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
				className,
			)}
			{...props}
		/>
	);
};

const FormSet = ({ className, ...props }: FormSetProps) => {
	return (
		<fieldset
			data-slot="field-set"
			className={cn(
				"flex flex-col gap-6",
				"has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
				className,
			)}
			{...props}
		/>
	);
};

const Legend = ({
	className,
	variant = "legend",
	...props
}: FormLegendProps) => {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(
				"mb-3 font-medium",
				"data-[variant=legend]:text-base",
				"data-[variant=label]:text-sm",
				className,
			)}
			{...props}
		/>
	);
};

const Separator = ({ children, className, ...props }: FormSeparatorProps) => {
	return (
		<div
			data-slot="field-separator"
			data-content={!!children}
			className={cn(
				"relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
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

export const Form = {
	Root,
	Group,
	Set: FormSet,
	Legend,
	Separator,
};

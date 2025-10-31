import type { ComponentProps, ComponentType, ReactNode } from "react";

type FormApiWithAppForm = {
	AppForm: ComponentType<{
		children?: ReactNode | undefined;
	}>;
};

export type FormRootProps = {
	form: FormApiWithAppForm;
	className?: string;
	children?: ReactNode;
};

export type FormGroupProps = ComponentProps<"div">;

export type FormLegendProps = ComponentProps<"legend"> & {
	variant?: "legend" | "label";
};

export type FormSeparatorProps = ComponentProps<"div"> & {
	children?: ReactNode;
};

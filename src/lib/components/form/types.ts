import type { ComponentProps, ComponentType, ReactNode } from "react";

type FormApiWithAppForm = {
	AppForm: ComponentType<{
		children?: ReactNode | undefined;
	}>;
};

export type FormRootProps = ComponentProps<"form"> & {
	form?: FormApiWithAppForm;
};

export type FormGroupProps = ComponentProps<"div">;

export type FormSetProps = ComponentProps<"fieldset">;

export type FormLegendProps = ComponentProps<"legend"> & {
	variant?: "legend" | "label";
};

export type FormSeparatorProps = ComponentProps<"div"> & {
	children?: ReactNode;
};

export type FormGroupProps = React.ComponentProps<"div">;

export type FormSetProps = React.ComponentProps<"fieldset">;

export type FormLegendProps = React.ComponentProps<"legend"> & {
	variant?: "legend" | "label";
};

export type FormSeparatorProps = React.ComponentProps<"div"> & {
	children?: React.ReactNode;
};

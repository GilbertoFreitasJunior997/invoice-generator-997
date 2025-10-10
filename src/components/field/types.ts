import type { VariantProps } from "class-variance-authority";
import type { Label as LabelComponent } from "@/components/label";
import type { fieldVariants } from "./consts";

export type FieldRootProps = React.ComponentProps<"fieldset"> &
	VariantProps<typeof fieldVariants>;

export type FieldLabelProps = React.ComponentProps<typeof LabelComponent>;

export type FieldErrorProps = React.ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>;
};

export type FieldDescriptionProps = React.ComponentProps<"p">;

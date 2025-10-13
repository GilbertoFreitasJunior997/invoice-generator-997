import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { Label as LabelComponent } from "@/components/label";
import type { fieldVariants } from "./consts";

export type FieldRootProps = ComponentProps<"fieldset"> &
	VariantProps<typeof fieldVariants>;

export type FieldLabelProps = ComponentProps<typeof LabelComponent>;

export type FieldErrorProps = ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>;
};

export type FieldDescriptionProps = ComponentProps<"p">;

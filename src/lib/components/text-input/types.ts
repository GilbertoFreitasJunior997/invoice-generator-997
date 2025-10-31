import type { ComponentProps } from "react";
import type { BaseInputProps } from "../base-field/types";

export type TextInputProps = BaseInputProps<string | undefined> &
	Pick<ComponentProps<"input">, "type">;

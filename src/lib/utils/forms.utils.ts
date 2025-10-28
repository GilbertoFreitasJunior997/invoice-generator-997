import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { NumberInput } from "@/lib/components/number-input";
import { SelectInput } from "@/lib/components/select-input";
import { SubmitButton } from "@/lib/components/submit-button";
import { TextAreaInput } from "@/lib/components/text-area-input";
import { TextInput } from "@/lib/components/text-input";
import { ComboboxInput } from "../components/combobox-input";

export const { formContext, fieldContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	formContext,
	fieldContext,
	fieldComponents: {
		TextInput,
		SelectInput,
		TextAreaInput,
		NumberInput,
		ComboboxInput,
	},
	formComponents: {
		SubmitButton,
	},
});

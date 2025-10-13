import type z from "zod";

type isInputRequiredParams = {
	formSchema: z.ZodObject;
	fieldName: string;
};

const isString = (fieldSchema: z.ZodType): fieldSchema is z.ZodString => {
	return fieldSchema.type === "string";
};

export const isInputRequired = ({
	formSchema,
	fieldName,
}: isInputRequiredParams) => {
	const fieldSchema = formSchema.shape[fieldName];

	if (!fieldSchema) {
		return false;
	}

	if (!isString(fieldSchema)) {
		return false;
	}
	const checks = fieldSchema.def.checks ?? [];
	return checks.some((check) => check._zod.def.check === "min_length");
};

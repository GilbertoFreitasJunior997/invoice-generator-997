import { isServer } from "@tanstack/react-query";
import z from "zod";

// error map for forms
const clientErrorMap: z.core.$ZodErrorMap<z.core.$ZodIssue> = (issue) => {
	return issue.message;
};

const customError: z.core.$ZodErrorMap<z.core.$ZodIssue> | undefined = isServer
	? undefined
	: clientErrorMap;

z.config({
	customError,
});

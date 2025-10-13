import { isServer } from "@tanstack/react-query";
import z from "zod";

const fieldRequiredMessage = "This field is required";

// error messages for forms
const clientErrorMap: z.core.$ZodErrorMap<z.core.$ZodIssue> = (issue) => {
	switch (issue.code) {
		case "invalid_type": {
			if (issue.received === "undefined" || issue.received === "null") {
				return { message: fieldRequiredMessage };
			}
			return {
				message: `Expected ${issue.expected}, received ${issue.received}`,
			};
		}

		case "too_small": {
			if (issue.minimum === 1) {
				return { message: fieldRequiredMessage };
			}
			return {
				message: `Must be at least ${issue.minimum} character${issue.minimum === 1 ? "" : "s"}`,
			};
		}

		case "too_big": {
			return {
				message: `Must be no more than ${issue.maximum} character${issue.maximum === 1 ? "" : "s"}`,
			};
		}

		case "invalid_format": {
			if (issue.validation === "email") {
				return {
					message: "Please enter a valid email address",
				};
			}
			return { message: "Invalid format" };
		}

		default:
			if (typeof issue.message === "string" && issue.message.length > 0) {
				return { message: issue.message };
			}
			return { message: "Please check this field" };
	}
};

const customError = isServer ? undefined : clientErrorMap;

z.config({
	customError,
});

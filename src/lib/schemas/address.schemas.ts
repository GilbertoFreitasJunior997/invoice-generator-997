import z from "zod";
import { countryEnumSchema } from "./countries.schemas";

export const addressSchema = z.object({
	addressLine1: z.string().min(1),
	addressLine2: z.string(),
	city: z.string().min(1),
	state: z.string().min(1),
	country: countryEnumSchema,
	zip: z.string().min(1),
	taxId: z.string(),
});

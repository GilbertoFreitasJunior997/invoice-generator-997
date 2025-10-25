import z from "zod";

export const currencyEnumSchema = z.enum(["USD", "BRL"]);

export const currencies = currencyEnumSchema.options;
export type Currency = z.infer<typeof currencyEnumSchema>;

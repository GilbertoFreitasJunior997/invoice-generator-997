import z from "zod";
import type { SelectInputItem } from "../components/select-input/types";

export const countryEnumSchema = z.enum(["USA", "Brazil"]);

export const countries = countryEnumSchema.options;
export type Country = (typeof countries)[number];

export const countriesSelectOptions = countries.map((country) => ({
	label: country,
	value: country,
})) satisfies SelectInputItem[];

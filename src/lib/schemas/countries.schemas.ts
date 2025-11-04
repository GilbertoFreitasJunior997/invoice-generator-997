import z from "zod";
import { createSelectOptions } from "../components/select/utils";

export const countryEnumSchema = z.enum(["USA", "Brazil"]);

export const countries = countryEnumSchema.options;
export type Country = (typeof countries)[number];

export const countriesSelectOptions = createSelectOptions(countries);

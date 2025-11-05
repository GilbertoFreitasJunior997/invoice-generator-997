import z from "zod";
import { createSelectOptions } from "../components/select/utils";

export const currencyEnumSchema = z.enum(["USD", "BRL"]);
export const currencies = currencyEnumSchema.options;
export const currenciesSelectOptions = createSelectOptions(currencies);
export type Currency = (typeof currencies)[number];

const currencyPrefixes: Record<Currency, string> = {
	USD: "$",
	BRL: "R$",
};

const currencyThousandSeparators: Record<Currency, string> = {
	USD: ".",
	BRL: ",",
};

const currencyDecimalSeparators: Record<Currency, string> = {
	USD: ",",
	BRL: ".",
};

export const getCurrencyConfig = (currency: Currency = "USD") => {
	return {
		prefix: currencyPrefixes[currency],
		thousandSeparator: currencyThousandSeparators[currency],
		decimalSeparator: currencyDecimalSeparators[currency],
	};
};

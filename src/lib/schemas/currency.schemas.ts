import z from "zod";
import type { SelectInputItem } from "../components/select-input/types";

export const currencyEnumSchema = z.enum(["USD", "BRL"]);

export const currencies = currencyEnumSchema.options;
export type Currency = (typeof currencies)[number];

export const currencyPrefixes: Record<Currency, string> = {
	USD: "$",
	BRL: "R$",
};

export const currencyThousandSeparators: Record<Currency, string> = {
	USD: ".",
	BRL: ",",
};

export const currencyDecimalSeparators: Record<Currency, string> = {
	USD: ",",
	BRL: ".",
};

export const currenciesSelectOptions = currencies.map((currency) => ({
	label: currency,
	value: currency,
})) satisfies SelectInputItem[];

export const getCurrencyConfig = (currency: Currency = "USD") => {
	return {
		prefix: currencyPrefixes[currency],
		thousandSeparator: currencyThousandSeparators[currency],
		decimalSeparator: currencyDecimalSeparators[currency],
	};
};

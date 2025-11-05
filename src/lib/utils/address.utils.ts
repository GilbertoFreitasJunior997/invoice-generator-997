import type { Country } from "../schemas/countries.schemas";

export const defaultCountry: Country = "USA";

export type CountryPlaceholders = {
	addressLine1: string;
	addressLine2: string;
	state: string;
	city: string;
	zip: string;
	taxId: string;
};

const countryPlaceholders = {
	USA: {
		addressLine1: "123 Main Street",
		addressLine2: "Apt 123",
		state: "CA",
		city: "San Francisco",
		zip: "12345",
		taxId: "1234567890",
	},
	Brazil: {
		addressLine1: "Rua Das Flores 123, Bairro",
		addressLine2: "Apartamento 123",
		state: "SP",
		city: "São Paulo",
		zip: "12345-678",
		taxId: "00.000.000/0001-00",
	},
} satisfies Record<Country, CountryPlaceholders>;

const getCountryPlaceholders = (country: Country) =>
	countryPlaceholders[country] ?? countryPlaceholders.USA;

export const getCountryAddressLine1Placeholder = (country: Country) =>
	getCountryPlaceholders(country).addressLine1;

export const getCountryAddressLine2Placeholder = (country: Country) =>
	getCountryPlaceholders(country).addressLine2;

export const getCountryStatePlaceholder = (country: Country) =>
	getCountryPlaceholders(country).state;

export const getCountryCityPlaceholder = (country: Country) =>
	getCountryPlaceholders(country).city;

export const getCountryZipPlaceholder = (country: Country) =>
	getCountryPlaceholders(country).zip;

export const getCountryTaxIdPlaceholder = (country: Country) =>
	getCountryPlaceholders(country).taxId;

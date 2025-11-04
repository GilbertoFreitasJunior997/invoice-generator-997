import z from "zod";
import { createSelectOptions } from "../components/select/utils";

export const invoiceStatusEnumSchema = z.enum(["pending", "paid", "overdue"]);
export const invoiceStatuses = invoiceStatusEnumSchema.options;
export const invoiceStatusSelectOptions = createSelectOptions(invoiceStatuses);
export type InvoiceStatus = (typeof invoiceStatuses)[number];

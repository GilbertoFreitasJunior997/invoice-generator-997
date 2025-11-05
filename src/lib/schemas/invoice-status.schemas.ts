import z from "zod";

const invoiceStatusEnumSchema = z.enum(["pending", "paid", "overdue"]);
export const invoiceStatuses = invoiceStatusEnumSchema.options;
export type InvoiceStatus = (typeof invoiceStatuses)[number];

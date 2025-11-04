import z from "zod";
import { createSelectOptions } from "../components/select/utils";

export const clientStatusEnumSchema = z.enum(["active", "inactive"]);
export const clientStatuses = clientStatusEnumSchema.options;
export const clientStatusSelectOptions = createSelectOptions(clientStatuses);
export type ClientStatus = (typeof clientStatuses)[number];

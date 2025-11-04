import z from "zod";
import { createSelectOptions } from "../components/select/utils";

export const serviceStatusEnumSchema = z.enum(["active", "inactive"]);
export const serviceStatuses = serviceStatusEnumSchema.options;
export const serviceStatusSelectOptions = createSelectOptions(serviceStatuses);
export type ServiceStatus = (typeof serviceStatuses)[number];

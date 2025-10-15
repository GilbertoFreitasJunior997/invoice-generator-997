import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { clientsTable } from "../db/tables/clients.table";

export const clientSelectSchema = createSelectSchema(clientsTable);
export type ClientSelect = z.infer<typeof clientSelectSchema>;

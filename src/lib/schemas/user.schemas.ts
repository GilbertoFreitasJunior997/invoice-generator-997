import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { usersTable } from "../db/tables/user.table";

export const userSelectSchema = createSelectSchema(usersTable);

export const getAuthUserSchema = z.object({
	id: z.string(),
	email: z.string(),
});

export const userSetupAccountFormSchema = z.object({
	name: z.string().min(1),
	addressLine1: z.string().min(1),
	addressLine2: z.string().min(1),
});

export const userSetupAccountSchema = userSetupAccountFormSchema.extend(
	userSelectSchema.pick({ workOsId: true, email: true }).shape,
);

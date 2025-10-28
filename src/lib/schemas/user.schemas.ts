import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { usersTable } from "../db/tables/user.table";

export const userSelectSchema = createSelectSchema(usersTable);
export type UserSelect = z.infer<typeof userSelectSchema>;

export const getAuthUserSchema = z.object({
	id: z.string(),
	email: z.string(),
});

export const userSetupAccountFormSchema = z.object({
	name: z.string().min(1),
	email: z.email().min(1),
	addressLine1: z.string().min(1),
	addressLine2: z.string(),
	city: z.string().min(1),
	state: z.string().min(1),
	country: z.string().min(1),
	zip: z.string().min(1),
	taxId: z.string(),
});
export type UserSetupAccountForm = z.infer<typeof userSetupAccountFormSchema>;

export const userSetupAccountSchema = userSetupAccountFormSchema.extend(
	userSelectSchema.pick({ workOsId: true, avatarUrl: true }).shape,
);

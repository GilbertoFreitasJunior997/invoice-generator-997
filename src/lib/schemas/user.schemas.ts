import z from "zod";

export const getAuthUserSchema = z.object({
	id: z.string(),
	email: z.string(),
});

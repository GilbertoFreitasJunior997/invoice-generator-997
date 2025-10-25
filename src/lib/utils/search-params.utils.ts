import { z } from "zod";

export const entitySearchParamsSchema = z.object({
	isCreating: z.boolean().optional(),
	editId: z.string().optional(),
	removeId: z.string().optional(),
});

import z from "zod";

export const envServerSchema = z.object({
	DATABASE_AUTH_TOKEN: z.string().min(1),
	DATABASE_URL: z.string().min(1),
});

export type EnvServer = z.infer<typeof envServerSchema>;

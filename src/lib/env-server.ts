import { envServerSchema } from "./schemas/env-server.schema";

const result = envServerSchema.safeParse(process.env);

if (!result.success) {
	throw new Error("Invalid environment variables");
}

export const envServer = result.data;

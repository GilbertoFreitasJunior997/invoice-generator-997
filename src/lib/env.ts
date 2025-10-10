import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		TURSO_CONNECTION_URL: z.string().min(1),
		TURSO_AUTH_TOKEN: z.string().min(1),
		WORKOS_REDIRECT_URI: z.string().min(1),
		WORKOS_API_KEY: z.string().min(1),
		WORKOS_CLIENT_ID: z.string().min(1),
		WORKOS_COOKIE_PASSWORD: z.string().min(1),
	},

	clientPrefix: "VITE_",
	client: {},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});

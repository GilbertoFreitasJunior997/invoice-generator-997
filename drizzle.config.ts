import { defineConfig } from "drizzle-kit";
import { envServer } from "@/lib/env-server";

export default defineConfig({
	schema: "./src/lib/db/tables",
	dialect: "turso",
	dbCredentials: {
		url: envServer.DATABASE_URL,
		authToken: envServer.DATABASE_AUTH_TOKEN,
	},
});

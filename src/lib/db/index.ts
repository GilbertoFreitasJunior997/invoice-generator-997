import { drizzle } from "drizzle-orm/libsql";
import { envServer } from "../env-server";

export const db = drizzle({
	connection: {
		url: envServer.DATABASE_URL,
		authToken: envServer.DATABASE_AUTH_TOKEN,
	},
});

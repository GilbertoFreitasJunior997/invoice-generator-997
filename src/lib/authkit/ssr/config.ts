import { env } from "@/lib/env";
import type { AuthKitConfig } from "./interfaces.js";

const COOKIE_NAME = "wos-session";
// Defaults to 400 days, the maximum allowed by Chrome
// It's fine to have a long cookie expiry date as the access/refresh tokens
// act as the actual time-limited aspects of the session.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 400;
const API_HOSTNAME = "api.workos.com";

export const authkitConfig: AuthKitConfig = {
	cookieName: COOKIE_NAME,
	apiHttps: true,
	cookieMaxAge: COOKIE_MAX_AGE,
	apiHostname: API_HOSTNAME,
	apiKey: env.WORKOS_API_KEY,
	clientId: env.WORKOS_CLIENT_ID,
	redirectUri: env.WORKOS_REDIRECT_URI,
	cookiePassword: env.WORKOS_COOKIE_PASSWORD,
};

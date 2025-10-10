import { createServerFn } from "@tanstack/react-start";
import { deleteCookie } from "@tanstack/react-start/server";
import { env } from "../env";
import { authkitConfig } from "./ssr/config";
import type { GetAuthURLOptions, NoUserInfo, UserInfo } from "./ssr/interfaces";
import { terminateSession, withAuth } from "./ssr/session";
import { getWorkOS } from "./ssr/workos";

export const getAuthorizationUrl = createServerFn({ method: "GET" })
	.inputValidator((options?: GetAuthURLOptions) => options)
	.handler(({ data: options = {} }) => {
		const { returnPathname, screenHint, redirectUri } = options;

		return getWorkOS().userManagement.getAuthorizationUrl({
			provider: "authkit",
			clientId: env.WORKOS_CLIENT_ID,
			redirectUri: redirectUri || authkitConfig.redirectUri,
			state: returnPathname
				? btoa(JSON.stringify({ returnPathname }))
				: undefined,
			screenHint,
		});
	});

export const getSignInUrl = createServerFn({ method: "GET" })
	.inputValidator((data?: string) => data)
	.handler(async ({ data: returnPathname }) => {
		return await getAuthorizationUrl({
			data: { returnPathname, screenHint: "sign-in" },
		});
	});

export const getSignUpUrl = createServerFn({ method: "GET" })
	.inputValidator((data?: string) => data)
	.handler(async ({ data: returnPathname }) => {
		return getAuthorizationUrl({
			data: { returnPathname, screenHint: "sign-up" },
		});
	});

export const signOut = createServerFn({ method: "POST" })
	.inputValidator((data?: string) => data)
	.handler(async ({ data: returnTo }) => {
		const cookieName = authkitConfig.cookieName;
		deleteCookie(cookieName);
		await terminateSession({ returnTo });
	});

export const getAuth = createServerFn({ method: "GET" }).handler(
	async (): Promise<UserInfo | NoUserInfo> => {
		const auth = await withAuth();
		return auth;
	},
);

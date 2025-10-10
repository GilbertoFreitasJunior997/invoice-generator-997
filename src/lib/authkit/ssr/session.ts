import { redirect } from "@tanstack/react-router";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type { AccessToken, AuthenticationResponse } from "@workos-inc/node";
import { sealData, unsealData } from "iron-session";
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";
import { lazy } from "../../utils/lazy";
import { authkitConfig } from "./config";
import type {
	AuthkitOptions,
	AuthkitResponse,
	CookieOptions,
	GetAuthURLOptions,
	Session,
} from "./interfaces";
import { getWorkOS } from "./workos";

const sessionHeaderName = "x-workos-session";
const middlewareHeaderName = "x-workos-middleware";

export function getAuthorizationUrl(options: GetAuthURLOptions = {}) {
	const { returnPathname, screenHint, redirectUri } = options;

	return getWorkOS().userManagement.getAuthorizationUrl({
		provider: "authkit",
		clientId: authkitConfig.clientId,
		redirectUri: redirectUri || authkitConfig.redirectUri,
		state: returnPathname
			? btoa(JSON.stringify({ returnPathname }))
			: undefined,
		screenHint,
	});
}

export function serializeCookie(
	name: string,
	value: string,
	options: Partial<CookieOptions> = {},
): string {
	const {
		path = "/",
		maxAge = authkitConfig.cookieMaxAge,
		secure = options.sameSite === "none"
			? true
			: authkitConfig.redirectUri.startsWith("https:"),
		sameSite = "lax",
		domain = authkitConfig.cookieDomain,
	} = options;

	let cookie = `${name}=${encodeURIComponent(value)}; Path=${path}; sameSite=${sameSite}; HttpOnly`;
	cookie += `; Max-Age=${maxAge}`;
	if (!maxAge) cookie += `; Expires=${new Date(0).toUTCString()}`;
	if (secure) cookie += "; Secure";
	if (domain) cookie += `; Domain=${domain}`;

	return cookie;
}

export async function decryptSession(
	encryptedSession: string,
): Promise<Session> {
	const cookiePassword = authkitConfig.cookiePassword;
	return unsealData<Session>(encryptedSession, {
		password: cookiePassword,
	});
}

export async function encryptSession(session: Session) {
	return sealData(session, {
		password: authkitConfig.cookiePassword,
		ttl: 0,
	});
}

export async function withAuth() {
	const session = await getSessionFromCookie();

	if (!session?.user) {
		return { user: null };
	}

	const {
		sid: sessionId,
		org_id: organizationId,
		role,
		permissions,
		entitlements,
	} = decodeJwt<AccessToken>(session.accessToken);

	return {
		sessionId,
		user: session.user,
		organizationId,
		role,
		permissions,
		entitlements,
		impersonator: session.impersonator,
		accessToken: session.accessToken,
	};
}

export async function getSessionFromCookie() {
	const cookieName = authkitConfig.cookieName;
	const cookie = getCookie(cookieName);

	if (cookie) {
		return decryptSession(cookie);
	}
}

export async function saveSession(
	sessionOrResponse: Session | AuthenticationResponse,
): Promise<void> {
	const cookieName = authkitConfig.cookieName;
	const encryptedSession = await encryptSession(sessionOrResponse);
	setCookie(cookieName, encryptedSession);
}

// JWKS call only happens once and the result is cached. The lazy function ensures that
// the JWK set is only created when it's needed, and not before.
const JWKS = lazy(() =>
	createRemoteJWKSet(
		new URL(getWorkOS().userManagement.getJwksUrl(authkitConfig.clientId)),
	),
);

async function verifyAccessToken(accessToken: string): Promise<boolean> {
	try {
		await jwtVerify(accessToken, JWKS());
		return true;
	} catch {
		return false;
	}
}

function getReturnPathname(url: string): string {
	const newUrl = new URL(url);

	return `${newUrl.pathname}${newUrl.searchParams.size > 0 ? `?${newUrl.searchParams.toString()}` : ""}`;
}

export async function updateSession(
	request: Request,
	options: AuthkitOptions = { debug: false },
): Promise<AuthkitResponse> {
	const session = await getSessionFromCookie();

	const newRequestHeaders = new Headers();

	// Record that the request was routed through the middleware so we can check later for DX purposes
	newRequestHeaders.set(middlewareHeaderName, "true");

	// We store the current request url in a custom header, so we can always have access to it
	// This is because on hard navigations we don't have access to `next-url` but need to get the current
	// `pathname` to be able to return the users where they came from before sign-in
	newRequestHeaders.set("x-url", request.url);

	if (options.redirectUri) {
		// Store the redirect URI in a custom header, so we always have access to it and so that subsequent
		// calls to `getAuthorizationUrl` will use the same redirect URI
		newRequestHeaders.set("x-redirect-uri", options.redirectUri);
	}

	newRequestHeaders.delete(sessionHeaderName);

	if (!session) {
		if (options.debug) {
			console.log("No session found from cookie");
		}

		return {
			session: { user: null },
			headers: newRequestHeaders,
			authorizationUrl: getAuthorizationUrl({
				returnPathname: getReturnPathname(request.url),
				redirectUri: options.redirectUri || authkitConfig.redirectUri,
				screenHint: options.screenHint,
			}),
		};
	}

	const hasValidSession = await verifyAccessToken(session.accessToken);

	const cookieName = authkitConfig.cookieName;
	const cookie = getCookie(cookieName);

	if (hasValidSession && cookie) {
		newRequestHeaders.set(sessionHeaderName, cookie);

		const {
			sid: sessionId,
			org_id: organizationId,
			role,
			permissions,
			entitlements,
		} = decodeJwt<AccessToken>(session.accessToken);

		return {
			session: {
				sessionId,
				user: session.user,
				organizationId,
				role,
				permissions,
				entitlements,
				impersonator: session.impersonator,
				accessToken: session.accessToken,
			},
			headers: newRequestHeaders,
		};
	}

	try {
		if (options.debug) {
			// istanbul ignore next
			console.log(
				`Session invalid. ${session.accessToken ? `Refreshing access token that ends in ${session.accessToken.slice(-10)}` : "Access token missing."}`,
			);
		}

		const { org_id: organizationIdFromAccessToken } = decodeJwt<AccessToken>(
			session.accessToken,
		);

		const { accessToken, refreshToken, user, impersonator } =
			await getWorkOS().userManagement.authenticateWithRefreshToken({
				clientId: authkitConfig.clientId,
				refreshToken: session.refreshToken,
				organizationId: organizationIdFromAccessToken,
			});

		if (options.debug) {
			console.log("Session successfully refreshed");
		}
		// Encrypt session with new access and refresh tokens
		const encryptedSession = await encryptSession({
			accessToken,
			refreshToken,
			user,
			impersonator,
		});

		newRequestHeaders.append(
			"Set-Cookie",
			serializeCookie(cookieName, encryptedSession),
		);
		newRequestHeaders.set(sessionHeaderName, encryptedSession);

		const {
			sid: sessionId,
			org_id: organizationId,
			role,
			permissions,
			entitlements,
		} = decodeJwt<AccessToken>(accessToken);

		return {
			session: {
				sessionId,
				user,
				organizationId,
				role,
				permissions,
				entitlements,
				impersonator,
				accessToken,
			},
			headers: newRequestHeaders,
		};
	} catch (e) {
		if (options.debug) {
			console.log("Failed to refresh. Deleting cookie.", e);
		}

		// When we need to delete a cookie, return it as a header as you can't delete cookies from edge middleware
		const deleteCookie = serializeCookie(cookieName, "", { maxAge: 0 });
		newRequestHeaders.append("Set-Cookie", deleteCookie);

		return {
			session: { user: null },
			headers: newRequestHeaders,
			authorizationUrl: getAuthorizationUrl({
				returnPathname: getReturnPathname(request.url),
			}),
		};
	}
}

export async function terminateSession({
	returnTo,
}: {
	returnTo?: string;
} = {}) {
	const { sessionId } = await withAuth();
	if (sessionId) {
		const href = getWorkOS().userManagement.getLogoutUrl({
			sessionId,
			returnTo,
		});
		return redirect({ href, throw: true, reloadDocument: true });
	}

	return redirect({ to: returnTo ?? "/", throw: true, reloadDocument: true });
}

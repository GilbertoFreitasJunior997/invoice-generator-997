import { redirect } from "@tanstack/react-router";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type { AccessToken, AuthenticationResponse } from "@workos-inc/node";
import { sealData, unsealData } from "iron-session";
import { decodeJwt } from "jose";
import { authkitConfig } from "./config";
import type { Session } from "./interfaces";
import { getWorkOS } from "./workos";

async function decryptSession(encryptedSession: string): Promise<Session> {
	const cookiePassword = authkitConfig.cookiePassword;
	return unsealData<Session>(encryptedSession, {
		password: cookiePassword,
	});
}

async function encryptSession(session: Session) {
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

async function getSessionFromCookie() {
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

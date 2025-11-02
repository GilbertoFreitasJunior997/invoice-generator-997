import { setResponseStatus } from "@tanstack/react-start/server";
import { ServerError } from "../errors/server-fns.errors";

export const DEFAULT_ERROR_MESSAGE = "Something went wrong! Please try again.";

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
} as const;

export type HTTPStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export type ServerResponse<TData> = {
	data: TData;
	message?: string;
};

export type CreateServerSuccessResponseParams<TData = null> = {
	data?: TData;
	message?: string;
	status?: HTTPStatusCode;
};

export const createServerSuccessResponse = <TData = null>(
	params?: CreateServerSuccessResponseParams<TData>,
): ServerResponse<TData> => {
	const { data, message, status = HTTP_STATUS.OK } = params ?? {};

	setResponseStatus(status);

	return {
		data: data ?? (null as unknown as TData),
		message: message || undefined,
	};
};

export type CreateServerErrorResponseParams = {
	error?: unknown;
};
export const createServerErrorResponse = ({
	error,
}: CreateServerErrorResponseParams): never => {
	let message: string | undefined;
	let status: HTTPStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

	if (error instanceof Error) {
		message = error.message;

		if (error instanceof ServerError) {
			status = error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
		}
	}

	console.error("--------------------------------");
	console.error("createServerErrorResponse", error);
	console.error("--------------------------------");

	throw new Error(message, { cause: { status } });
};

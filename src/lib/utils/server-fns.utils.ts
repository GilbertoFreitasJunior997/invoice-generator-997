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

export type ServerSuccessResponse<TData> = {
	success: true;
	message?: string;
	data: TData;
};

export type ServerErrorResponse = {
	success: false;
	message?: string;
	rawError: object;
};

export type ServerResponse<TData> =
	| ServerSuccessResponse<TData>
	| ServerErrorResponse;

export type CreateServerSuccessResponseParams<TData = null> = {
	data?: TData;
	message?: string;
	status?: HTTPStatusCode;
};

export const createServerSuccessResponse = <TData = null>(
	params?: CreateServerSuccessResponseParams<TData>,
): ServerSuccessResponse<TData> => {
	const { data, message, status = HTTP_STATUS.OK } = params ?? {};

	setResponseStatus(status);

	return {
		success: true,
		data: data ?? (null as unknown as TData),
		message,
	};
};

export type CreateServerErrorResponseParams = {
	error?: unknown;
};
export const createServerErrorResponse = ({
	error,
}: CreateServerErrorResponseParams): ServerErrorResponse => {
	let message = DEFAULT_ERROR_MESSAGE;
	let status: HTTPStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

	if (error instanceof Error) {
		message = error.message;

		if (error instanceof ServerError) {
			status = error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
		}
	}

	setResponseStatus(status);

	return {
		success: false,
		message,
		rawError: error as object,
	};
};

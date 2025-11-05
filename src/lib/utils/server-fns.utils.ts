import { setResponseStatus } from "@tanstack/react-start/server";
import { ServerError } from "../errors/server-fns.errors";
import { HTTP_STATUS, type HTTPStatusCode } from "./server-fns-types.utils";

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

import {
	DEFAULT_ERROR_MESSAGE,
	HTTP_STATUS,
	type HTTPStatusCode,
} from "../utils/server-fns-types.utils";

export class ServerError extends Error {
	status: HTTPStatusCode;

	constructor(message: string, status: HTTPStatusCode) {
		super(message);
		this.status = status;
	}
}

export class ServerBadRequestError extends ServerError {
	constructor(message?: string) {
		super(message ?? DEFAULT_ERROR_MESSAGE, HTTP_STATUS.BAD_REQUEST);
	}
}

export class ServerNotFoundError extends ServerError {
	constructor(message?: string) {
		super(message ?? DEFAULT_ERROR_MESSAGE, HTTP_STATUS.NOT_FOUND);
	}
}

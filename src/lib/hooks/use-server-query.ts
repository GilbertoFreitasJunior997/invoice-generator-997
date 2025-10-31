import {
	type AnyUseQueryOptions,
	type QueryFunctionContext,
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";
import { toast } from "sonner";
import type {
	ServerErrorResponse,
	ServerResponse,
	ServerSuccessResponse,
} from "../utils/server-fns.utils";

const isServerResponse = (
	response: unknown,
): response is ServerResponse<unknown> => {
	return (
		typeof response === "object" && response !== null && "success" in response
	);
};

const isServerError = (
	// biome-ignore lint/suspicious/noExplicitAny: any makes it easier to check for the properties
	error: any,
): error is { result: ServerErrorResponse } => {
	return error?.result?.success === false;
};

type UseServerQueryResult<TQueryOptions extends AnyUseQueryOptions> =
	TQueryOptions extends UseQueryOptions<
		infer TQueryFnData,
		infer TError,
		infer _TData,
		infer _TQueryKey
	>
		? TQueryFnData extends ServerSuccessResponse<infer TServerResponseData>
			? UseQueryResult<TServerResponseData, TError>
			: TQueryFnData extends ServerErrorResponse
				? UseQueryResult<never, TError>
				: UseQueryResult<TQueryFnData, TError>
		: never;

type UseServerMutationResult<TMutationOptions extends UseMutationOptions> =
	TMutationOptions extends UseMutationOptions<
		infer TMutationFnData,
		infer TError,
		infer TVariables,
		infer TMutationResult
	>
		? TMutationFnData extends ServerSuccessResponse<infer TServerResponseData>
			? UseMutationResult<
					TServerResponseData,
					TError,
					TVariables,
					TMutationResult
				>
			: TMutationFnData extends ServerErrorResponse
				? UseMutationResult<never, TError, TVariables, TMutationResult>
				: UseMutationResult<
						TMutationFnData,
						TError,
						TVariables,
						TMutationResult
					>
		: never;

type HandleServerResponseParams<T extends Promise<unknown>> = {
	promise: T;
	isMutation: boolean;
};
const handleServerResponse = async <T extends Promise<unknown>>({
	promise,
	isMutation,
}: HandleServerResponseParams<T>) => {
	try {
		const result = await promise;

		if (isServerResponse(result)) {
			// response will always be success, since success = false throws an error
			if (!result.success) {
				throw result;
			}

			if (isMutation && result.message) {
				toast.success(result.message);
			}

			return result.data;
		}

		return result ?? null;
	} catch (error) {
		let message: string | undefined;

		if (isServerError(error)) {
			message = error.result.message;
		} else if (error instanceof Error) {
			message = error.message;
		}

		if (message) {
			toast.error(message);
		}

		console.error("--------------------------------");
		console.error(`ERROR ON ${isMutation ? "MUTATION" : "QUERY"}`);
		console.error(error);
		console.error("--------------------------------");

		throw error;
	}
};

const createServerQueryFn = <TQueryOptions extends AnyUseQueryOptions>(
	queryOptions: TQueryOptions,
) => {
	return async (context: QueryFunctionContext) => {
		if (!queryOptions.queryFn || typeof queryOptions.queryFn !== "function") {
			throw new Error("Query function is required");
		}

		return handleServerResponse({
			promise: queryOptions.queryFn(context),
			isMutation: false,
		});
	};
};

export const useServerQuery = <TQueryOptions extends AnyUseQueryOptions>(
	options: TQueryOptions,
): UseServerQueryResult<TQueryOptions> => {
	const query = useQuery({
		...options,
		select: (result) => {
			const data = result.data;

			if (options.select) {
				return options.select(data);
			}

			return data;
		},
	}) as UseServerQueryResult<TQueryOptions>;

	const { error, isFetching } = query;

	const showNotifications = useEffectEvent(() => {
		let message: string | undefined;

		if (isServerError(error)) {
			message = error.result.message;
		} else if (error instanceof Error) {
			message = error.message;
		}

		if (!message) {
			return;
		}

		toast.error(message);
	});

	useEffect(() => {
		if (isFetching) {
			return;
		}

		showNotifications();
	}, [isFetching]);

	return query;
};

export const useServerSuspenseQuery = <
	TQueryOptions extends AnyUseQueryOptions,
>(
	options: TQueryOptions,
): UseServerQueryResult<TQueryOptions> => {
	return useSuspenseQuery({
		...options,
		queryFn: createServerQueryFn(options),
	}) as UseServerQueryResult<TQueryOptions>;
};

type AnyUseMutationOptions = Omit<
	// biome-ignore lint/suspicious/noExplicitAny: we need to use any to match the mutation function
	UseMutationOptions<any, any, any, any>,
	"mutationKey"
>;
export const useServerMutation = <
	TMutationOptions extends AnyUseMutationOptions,
>(
	options: TMutationOptions,
) => {
	return useMutation({
		...options,
		mutationFn: async (
			args: Parameters<NonNullable<TMutationOptions["mutationFn"]>>[0],
			context: QueryFunctionContext,
		) => {
			if (!options.mutationFn || typeof options.mutationFn !== "function") {
				throw new Error("Mutation function is required");
			}

			return handleServerResponse({
				promise: options.mutationFn(args, context),
				isMutation: true,
			});
		},
	}) as UseServerMutationResult<TMutationOptions>;
};

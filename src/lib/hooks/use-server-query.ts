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
import type { ServerResponse } from "../utils/server-fns.utils";

type UseServerQueryResult<TQueryOptions extends AnyUseQueryOptions> =
	TQueryOptions extends UseQueryOptions<
		infer TQueryFnData,
		infer TError,
		infer _TData,
		infer _TQueryKey
	>
		? TQueryFnData extends ServerResponse<infer TServerResponseData>
			? UseQueryResult<TServerResponseData, TError>
			: UseQueryResult<TQueryFnData, TError>
		: never;

type UseServerMutationResult<TMutationOptions extends UseMutationOptions> =
	TMutationOptions extends UseMutationOptions<
		infer TMutationFnData,
		infer TError,
		infer TVariables,
		infer TMutationResult
	>
		? TMutationFnData extends ServerResponse<infer TServerResponseData>
			? UseMutationResult<
					TServerResponseData,
					TError,
					TVariables,
					TMutationResult
				>
			: UseMutationResult<TMutationFnData, TError, TVariables, TMutationResult>
		: never;

type HandleServerResponseParams<T> = {
	promise: Promise<ServerResponse<T>>;
	isMutation: boolean;
};
const handleServerResponse = async <T>({
	promise,
	isMutation,
}: HandleServerResponseParams<T>) => {
	const result = await promise;

	if (isMutation && result.message) {
		toast.success(result.message);
	}

	return result.data;
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

		if (error instanceof Error) {
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

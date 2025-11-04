import z from "zod";

export const paginationSearchParamsSchema = z.object({
	page: z.number().optional(),
	pageSize: z.number().optional(),
});
export type PaginationSearchParams = z.infer<
	typeof paginationSearchParamsSchema
>;

export type PaginationServiceParams = Required<PaginationSearchParams> & {
	userId: string;
};

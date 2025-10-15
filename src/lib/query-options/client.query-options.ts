import { queryOptions } from "@tanstack/react-query";
import type { UserSelect } from "../schemas/user.schemas";
import { getAllClients } from "../services/client.service";

export const getAllClientsQueryOptions = (data: { user: UserSelect }) =>
	queryOptions({
		queryKey: ["clients", data.user.id],
		queryFn: () =>
			getAllClients({
				data,
			}),
	});

import type { ReactNode } from "react";

export type DataTableColumn<TData> = {
	accessorKey: keyof TData;
	header: ReactNode;
};

export type DataTableProps<TData> = {
	columns: DataTableColumn<TData>[];
	data: TData[] | undefined;

	onCreateClick?: () => void;
	onEditClick?: (data: TData) => void;
	onDeleteClick?: (data: TData) => void;
};

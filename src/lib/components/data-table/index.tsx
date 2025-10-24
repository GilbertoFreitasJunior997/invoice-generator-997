import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	type Table,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	EditIcon,
	MoreHorizontalIcon,
	TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/lib/components/button";
import { DropdownMenu } from "@/lib/components/dropdown-menu";
import { Select } from "@/lib/components/select";
import { Table as TableComponent } from "@/lib/components/table";
import { Checkbox } from "../checkbox";
import { dataTablePaginationOptions } from "./consts";
import type { DataTableProps } from "./types";

type DataTablePaginationProps<TData> = {
	table: Table<TData>;
};
const DataTablePagination = <TData,>({
	table,
}: DataTablePaginationProps<TData>) => {
	return (
		<div className="flex items-center justify-end space-x-2 py-4">
			<div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select.Root
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<Select.Trigger size="sm" className="w-[70px]">
							<Select.Value />
						</Select.Trigger>
						<Select.Content>
							{dataTablePaginationOptions.map((pageSize) => (
								<Select.Item key={pageSize} value={pageSize.toString()}>
									{pageSize}
								</Select.Item>
							))}
						</Select.Content>
					</Select.Root>
				</div>

				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>

				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronsLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<ChevronsRightIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};

type DataTableToolbarProps<TData> = {
	table: Table<TData>;
};
const DataTableToolbar = <TData,>({ table }: DataTableToolbarProps<TData>) => {
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				{/* <Input
					placeholder="Filter tasks..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/> */}
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="ml-auto hidden h-8 lg:flex"
					>
						Columns
						<ChevronDownIcon className="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="end" className="w-[150px]">
					{table
						.getAllColumns()
						.filter((column) => column.getCanHide())
						.map((column) => {
							return (
								<DropdownMenu.CheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value: boolean) =>
										column.toggleVisibility(!!value)
									}
								>
									{column.id}
								</DropdownMenu.CheckboxItem>
							);
						})}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	);
};

type DataTableContentProps<TData, TValue> = {
	table: Table<TData>;
	columns: ColumnDef<TData, TValue>[];
};
const DataTableContent = <TData, TValue>({
	table,
	columns,
}: DataTableContentProps<TData, TValue>) => {
	return (
		<div className="rounded-md border">
			<TableComponent.Root>
				<TableComponent.Header>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableComponent.Row key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableComponent.Head key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableComponent.Head>
								);
							})}
						</TableComponent.Row>
					))}
				</TableComponent.Header>

				<TableComponent.Body>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableComponent.Row
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableComponent.Cell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableComponent.Cell>
								))}
							</TableComponent.Row>
						))
					) : (
						<TableComponent.Row>
							<TableComponent.Cell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								No results.
							</TableComponent.Cell>
						</TableComponent.Row>
					)}
				</TableComponent.Body>
			</TableComponent.Root>
		</div>
	);
};

const createSelectColumn = <TData, TValue>(): ColumnDef<TData, TValue> => ({
	id: "select",
	header: ({ table }) => (
		<Checkbox
			checked={
				table.getIsAllPageRowsSelected() ||
				(table.getIsSomePageRowsSelected() && "indeterminate")
			}
			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			aria-label="Select all"
		/>
	),
	cell: ({ row }) => (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(value) => row.toggleSelected(!!value)}
			aria-label="Select row"
		/>
	),
	enableSorting: false,
	enableHiding: false,
});

const createDataColumns = <TData, TValue>(
	propsColumns: DataTableProps<TData>["columns"],
): ColumnDef<TData, TValue>[] => {
	return propsColumns.map(
		(columnItem) =>
			({
				id: columnItem.accessorKey.toString(),
				header: () => {
					return <div>{columnItem.header}</div>;
				},
				cell: ({ row }) => {
					return <div>{row.original[columnItem.accessorKey] as string}</div>;
				},
			}) satisfies ColumnDef<TData, TValue>,
	);
};

const createActionsColumn = <TData, TValue>(
	onEditClick?: (data: TData) => void,
	onDeleteClick?: (data: TData) => void,
): ColumnDef<TData, TValue> => ({
	id: "actions",
	cell: ({ row }) => {
		const rowData = row.original;

		return (
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild className="w-ful">
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontalIcon className="h-4 w-4" />
					</Button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="end">
					{!!onEditClick && (
						<DropdownMenu.Item onClick={() => onEditClick?.(rowData)}>
							<EditIcon className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenu.Item>
					)}

					{!!onDeleteClick && (
						<DropdownMenu.Item onClick={() => onDeleteClick?.(rowData)}>
							<TrashIcon className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenu.Item>
					)}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		);
	},
	enableSorting: false,
	enableHiding: false,
});

export const DataTable = <TData, TValue>({
	columns: propsColumns,
	data,
	onEditClick,
	onDeleteClick,
}: DataTableProps<TData>) => {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const hasActionsColumn = !!onEditClick || !!onDeleteClick;

	const columns = [
		createSelectColumn<TData, TValue>(),
		...createDataColumns<TData, TValue>(propsColumns),
		...(hasActionsColumn
			? [createActionsColumn<TData, TValue>(onEditClick, onDeleteClick)]
			: []),
	] satisfies ColumnDef<TData, TValue>[];

	const table = useReactTable({
		data: data ?? ([] as TData[]),
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div className="w-full space-y-4">
			<DataTableToolbar table={table} />

			<DataTableContent table={table} columns={columns} />

			<DataTablePagination table={table} />
		</div>
	);
};

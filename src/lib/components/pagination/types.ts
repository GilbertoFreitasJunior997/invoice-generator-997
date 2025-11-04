export type PaginationProps = {
	total: number;
	pageSize: number;
	pageIndex: number;
	resourceName: string;

	onPageSizeChange: (pageSize: number) => void;
	onPreviousPage: () => void;
	onNextPage: () => void;

	hideIfOnePage?: boolean;
	pageCount?: number;
	pageSizeOptions?: number[];
};

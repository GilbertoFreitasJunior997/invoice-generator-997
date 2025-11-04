import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../button";
import { SelectInput } from "../select-input";
import { paginationDefaultPageOptions } from "./consts";
import type { PaginationProps } from "./types";

export const Pagination = ({
	total,
	pageSize,
	pageIndex,
	resourceName,
	pageCount: propPageCount,
	hideIfOnePage = true,
	pageSizeOptions = paginationDefaultPageOptions,
	onPageSizeChange,
	onPreviousPage,
	onNextPage,
}: PaginationProps) => {
	const minPageSize = Math.min(...pageSizeOptions);

	const pageCount = propPageCount ?? Math.ceil(total / pageSize);
	const shouldHide =
		hideIfOnePage && pageSize === minPageSize && pageCount <= 1;

	if (shouldHide) {
		return null;
	}

	const selectOptions = pageSizeOptions.map((option) => ({
		value: option.toString(),
		label: option.toString(),
	}));

	// pageIndex is a 1-based index (so page 1 is 1 not 0)
	const start = (pageIndex - 1) * pageSize + 1;
	const end = Math.min(pageIndex * pageSize, total);

	return (
		<div className="flex items-center justify-end space-x-2">
			<p className="text-sm text-muted-foreground">
				Showing {start} - {end} of {total} {resourceName}
			</p>

			<div className="flex items-center space-x-6 lg:space-x-8 flex-1 justify-end">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium text-nowrap">
						{resourceName} per page
					</p>

					<SelectInput
						value={pageSize.toString()}
						onChange={(value) => onPageSizeChange(Number(value))}
						items={selectOptions}
					/>
				</div>

				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {pageIndex} of {pageCount}
				</div>

				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPreviousPage()}
						disabled={pageIndex <= 1}
					>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onNextPage()}
						disabled={pageIndex >= pageCount}
					>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};

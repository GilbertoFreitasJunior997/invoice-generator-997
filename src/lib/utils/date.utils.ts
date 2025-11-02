import { format } from "date-fns";

type FormatDbDateOptions = {
	withTime?: boolean;
	date?: Date;
};

export const formatDbDate = (params?: FormatDbDateOptions) => {
	const date = params?.date ?? new Date();
	const withTime = params?.withTime ?? true;

	return format(date, withTime ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd");
};

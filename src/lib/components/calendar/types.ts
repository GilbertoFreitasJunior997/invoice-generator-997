import type { ComponentProps } from "react";
import type { DayPicker } from "react-day-picker";
import type { Button } from "@/lib/components/button";

export type CalendarProps = ComponentProps<typeof DayPicker> & {
	buttonVariant?: ComponentProps<typeof Button>["variant"];
};

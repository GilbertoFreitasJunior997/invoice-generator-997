import { CircleDollarSignIcon } from "lucide-react";
import { appSettings } from "@/lib/app-settings";
import { cn } from "@/lib/utils/cn";
import type { LogoProps } from "./types";

export const Logo = ({ className, size = "default" }: LogoProps) => {
	return (
		<div
			className={cn(
				"flex items-center justify-start overflow-hidden gap-1",
				"bg-primary/5",
				size === "lg" && "py-3 px-3 rounded-lg w-min",
				className,
			)}
		>
			<div
				className={cn(
					"min-w-7 max-w-6 h-full rounded-sm flex items-center justify-center m-1",
					"border border-primary/20 bg-primary/10",
					className,
				)}
			>
				<CircleDollarSignIcon className="w-4" />
			</div>

			{size !== "sm" && (
				<h2 className="grow text-start text-nowrap font-semibold">
					{appSettings.name.toUpperCase()}
				</h2>
			)}
		</div>
	);
};

import { appSettings } from "@/lib/app-settings";
import { cn } from "@/lib/utils/cn";
import type { LogoProps } from "./types";

export const Logo = ({ className }: LogoProps) => {
	return (
		<h2
			className={cn(
				"text-sm font-bold text-primary tracking-wider inline-block bg-primary/10",
				"px-4 py-2 rounded-lg border border-primary/20",
				className,
			)}
		>
			{appSettings.name.toUpperCase()}
		</h2>
	);
};

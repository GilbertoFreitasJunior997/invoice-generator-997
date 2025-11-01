import { WalletMinimalIcon } from "lucide-react";
import { appSettings } from "@/lib/app-settings";
import { cn } from "@/lib/utils/cn";
import type { LogoProps } from "./types";

export const Logo = ({ className, isSmall = false }: LogoProps) => {
	return (
		<div
			className={cn(
				"flex items-center gap-2 justify-start",
				isSmall ? "text-xl" : "text-4xl",
				className,
			)}
		>
			<WalletMinimalIcon
				className={cn("text-primary", isSmall ? "size-8" : "size-14")}
			/>

			<span>{appSettings.name.toUpperCase()}</span>
		</div>
	);
};

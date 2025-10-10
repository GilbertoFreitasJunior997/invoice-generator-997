import type { ComponentProps, ReactNode } from "react";

export type CardProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type CardHeaderProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type CardTitleProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type CardDescriptionProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type CardActionProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type CardContentProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

export type CardFooterProps = ComponentProps<"div"> & {
	className?: string;
	children?: ReactNode;
};

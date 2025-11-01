export type LogoInputValue = {
	key?: string | null;
	file: File;
};

export type LogoInputProps = {
	imageKey?: string | null;
	onChange: (file?: LogoInputValue) => void;

	isLoading?: boolean;
	setIsLoading?: (isLoading: boolean) => void;
};

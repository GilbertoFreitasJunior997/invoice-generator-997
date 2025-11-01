import { PlusIcon, XIcon } from "lucide-react";
import {
	type ChangeEvent,
	type MouseEvent,
	useEffect,
	useEffectEvent,
	useId,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { useUnmount } from "usehooks-ts";
import { mbToBytes } from "@/lib/utils/blobs.utils";
import { cn } from "@/lib/utils/cn";
import { Button } from "../button";
import { Field } from "../field";
import { inputBorderStateClassNames } from "../field/consts";
import type { LogoInputProps, LogoInputValue } from "./types";
import { getLogoFromStorage } from "./utils";

const MAX_FILE_SIZE_MB = 5;
export const supportedImageExtensions = ["png", "jpeg", "jpg"];
export const supportedImageMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

export const LogoInput = ({
	imageKey,
	onChange,
	isLoading,
	setIsLoading,
}: LogoInputProps) => {
	const [imageSrc, setImageSrc] = useState<string>();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const fileInputId = useId();

	const handleRevokeUrl = useEffectEvent(() => {
		if (!imageSrc) {
			return;
		}

		URL.revokeObjectURL(imageSrc);
		setImageSrc(undefined);
	});

	const handleClearInput = () => {
		if (!fileInputRef.current) {
			return;
		}
		fileInputRef.current.value = "";
	};

	const handleRemoveLogo = (e?: MouseEvent<HTMLButtonElement>) => {
		e?.preventDefault();
		e?.stopPropagation();

		handleClearInput();
		setImageSrc(undefined);
		onChange(undefined);
		handleRevokeUrl();
	};

	const handleUpdateLogo = useEffectEvent(async (value: LogoInputValue) => {
		const { file } = value;

		const fileReader = new FileReader();

		fileReader.onload = (e) => {
			const arrayBuffer = e.target?.result as ArrayBuffer;
			const size = arrayBuffer.byteLength;

			if (size > mbToBytes(MAX_FILE_SIZE_MB)) {
				toast.error(
					`File is too big. Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
				);
				handleClearInput();
				setIsLoading?.(false);
				return;
			}

			const url = URL.createObjectURL(file);

			handleRevokeUrl();
			setImageSrc(url);
			onChange(value);
			setIsLoading?.(false);
		};

		setIsLoading?.(true);
		fileReader.readAsArrayBuffer(file);
	});

	const handleLoadFirstLogoByKey = useEffectEvent(async (imageKey: string) => {
		try {
			setIsLoading?.(true);
			const file = await getLogoFromStorage(imageKey);

			await handleUpdateLogo({ file, key: imageKey });
		} catch {
			toast.error("Failed to load logo. Please try again later.");
		} finally {
			setIsLoading?.(false);
		}
	});

	useEffect(() => {
		if (!imageKey) {
			return;
		}

		handleLoadFirstLogoByKey(imageKey);
	}, [imageKey]);

	useUnmount(() => {
		handleRevokeUrl();
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isLoading) {
			return;
		}

		const handleError = (error: string) => {
			toast.error(error);
			handleClearInput();
			setIsLoading?.(false);
			return;
		};

		const files = e.target.files;

		if (files?.length && files.length > 1) {
			handleError("Please upload only one file.");
			return;
		}

		const file = files?.[0];
		if (!file) {
			handleError("Please select a file.");
			return;
		}

		const extension = file?.name.split(".").pop();
		if (!extension || !supportedImageExtensions.includes(extension)) {
			handleError(
				"Please upload a file with a valid image extension. Supported extensions are: " +
					supportedImageExtensions.join(", "),
			);
			return;
		}

		handleUpdateLogo({ file, key: undefined });
	};

	return (
		<div className="w-fit flex-col h-46">
			<Field.Label label="Logo" className="pb-1 h-6" htmlFor={fileInputId} />

			<div
				className={cn(
					"h-40 w-40 rounded-md cursor-pointer bg-muted relative overflow-hidden",
					inputBorderStateClassNames,
					"outline-none border-transparent",
					isLoading && "opacity-50 cursor-not-allowed",
				)}
				onClick={() => fileInputRef.current?.click()}
				role="button"
				tabIndex={0}
			>
				{imageSrc && (
					<Button
						size="icon-sm"
						variant="secondary"
						className="absolute top-0 right-0 rounded-full opacity-70 hover:opacity-100"
						onClick={handleRemoveLogo}
						tabIndex={-1}
					>
						<XIcon className="size-4" />
					</Button>
				)}

				<input
					type="file"
					onChange={handleChange}
					ref={fileInputRef}
					disabled={isLoading}
					hidden
					accept={supportedImageMimeTypes.join(",")}
					multiple={false}
					max={1}
					id={fileInputId}
				/>
				{isLoading ? null : imageSrc ? (
					<img
						src={imageSrc}
						alt="Logo"
						className="w-full h-full object-cover bg-center bg-no-repeat bg-contain"
					/>
				) : (
					<div className="w-full h-full grid place-items-center">
						<PlusIcon className="size-6 text-gray-500" />
					</div>
				)}
			</div>
		</div>
	);
};

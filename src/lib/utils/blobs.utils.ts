type DownloadFileProps = {
	url: string;
	filename: string;
};

export const downloadFile = ({ url, filename }: DownloadFileProps) => {
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	a.remove();
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			const result = reader.result as string;
			if (!result) {
				reject(new Error("Failed to convert blob to base64"));

				return;
			}

			resolve(result);
		};

		reader.onerror = () =>
			reject(new Error("Failed to convert blob to base64"));

		reader.readAsDataURL(blob);
	});
};

export const mbToBytes = (mb: number) => {
	return mb * 1024 * 1024;
};

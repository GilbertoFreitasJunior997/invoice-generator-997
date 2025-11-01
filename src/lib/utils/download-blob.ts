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

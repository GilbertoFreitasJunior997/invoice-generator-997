import { getDeployStore } from "@netlify/blobs";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/lib/components/button";
import { HTTP_STATUS } from "@/lib/utils/server-fns.utils";

export const Route = createFileRoute("/_app/dashboard")({
	component: RouteComponent,
});

const blobToBase64 = (blob: Blob): Promise<string> => {
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
const uploadFile = createServerFn({ method: "POST" })
	.inputValidator(z.instanceof(FormData))
	.handler(async ({ data }) => {
		const file = data.get("file");
		if (!file || file instanceof File === false) {
			return;
		}

		const blob = await file.arrayBuffer();
		const contentType = file.type;

		const uploads = getDeployStore("file-uploads");
		await uploads.set(file.name, blob, {
			metadata: {
				contentType,
			},
		});

		return {
			key: file.name,
		};
	});

const testServerFn = createServerFn({ method: "GET" })
	.inputValidator(z.object({ store: z.string(), key: z.string() }))
	.handler(async ({ data }) => {
		try {
			const { store, key } = data;

			const uploads = getDeployStore(store);
			const stream = await uploads.get(key, { type: "stream" });

			if (!stream) {
				return new Response(null, { status: HTTP_STATUS.NOT_FOUND });
			}

			return new Response(stream);
		} catch {
			return new Response(null, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
		}
	});

function RouteComponent() {
	const [src, setSrc] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	useEffect(() => {
		(async () => {
			const response = await testServerFn({
				data: { store: "file-uploads", key: "test-extra-1.png" },
			});

			const blob = await response.blob();
			const base64 = await blobToBase64(blob);

			setSrc(base64);
		})();
	}, []);

	return (
		<div>
			<input
				type="file"
				onChange={async (e) => {
					const file = e.target.files?.[0];
					if (!file) {
						return;
					}
					setFile(file);

					const fileReader = new FileReader();
					fileReader.onload = (e) => {
						const arrayBuffer = e.target?.result as ArrayBuffer;
						const size = arrayBuffer.byteLength;
						if (size > 5 * 1024 * 1024) {
							toast.error(
								"File is too big. Please upload a file smaller than 5MB.",
							);
							return;
						}

						if (src) {
							URL.revokeObjectURL(src);
						}

						const newFileSrc = URL.createObjectURL(file);
						setSrc(newFileSrc);
					};
					fileReader.readAsDataURL(file);
				}}
			/>

			<Button
				disabled={!file}
				onClick={async () => {
					if (!file) {
						return;
					}

					const formData = new FormData();
					formData.append("file", file);

					await uploadFile({
						data: formData,
					});
				}}
			>
				Submit File
			</Button>

			{src && <img src={src} alt="Test File" />}
		</div>
	);
}

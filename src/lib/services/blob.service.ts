import { getDeployStore } from "@netlify/blobs";
import { createServerFn } from "@tanstack/react-start";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { HTTP_STATUS } from "../utils/server-fns.utils";

const getFormDataValues = (data: FormData) => {
	const file = data.get("file");
	let key = data.get("key");
	const store = data.get("store");

	if (!file || file instanceof File === false) {
		throw new Error("File is required");
	}

	if (!key) {
		key = uuidv4();
	} else if (typeof key !== "string") {
		throw new Error("Key must be a string");
	}

	if (!store || typeof store !== "string") {
		throw new Error("Please provide a store");
	}

	return { file, key, store };
};

export const uploadBlobToStorage = createServerFn({ method: "POST" })
	.inputValidator(z.instanceof(FormData))
	.handler(async ({ data }) => {
		const { file, key: baseKey, store } = getFormDataValues(data);

		const blob = await file.arrayBuffer();
		const contentType = file.type;
		const extension = file.name.split(".").pop();

		if (!extension) {
			throw new Error("File has no extension");
		}
		const key = `${baseKey}.${extension}`;

		const uploads = getDeployStore(store);
		await uploads.set(key, blob, {
			metadata: {
				contentType,
				extension,
			},
		});

		return {
			key,
		};
	});

export const getBlobFromStorage = createServerFn({ method: "GET" })
	.inputValidator(z.object({ store: z.string(), key: z.string() }))
	.handler(async ({ data }) => {
		try {
			const { store, key } = data;

			const uploads = getDeployStore(store);

			const result = await uploads.getWithMetadata(key, { type: "stream" });
			if (!result) {
				return new Response(null, { status: HTTP_STATUS.NOT_FOUND });
			}

			const {
				data: stream,
				metadata: { contentType },
			} = result;

			return new Response(stream, {
				headers: {
					"Content-Type": (contentType as string) ?? "application/octet-stream",
				},
			});
		} catch {
			return new Response(null, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
		}
	});

export const deleteBlobFromStorage = createServerFn()
	.inputValidator(z.object({ store: z.string(), key: z.string() }))
	.handler(async ({ data }) => {
		const { store, key } = data;

		try {
			const uploads = getDeployStore(store);
			await uploads.delete(key);
		} catch (error) {
			console.error(error);
		}
	});

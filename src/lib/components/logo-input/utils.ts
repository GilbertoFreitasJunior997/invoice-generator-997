import {
	deleteBlobFromStorage,
	getBlobFromStorage,
	uploadBlobToStorage,
} from "@/lib/services/blob.service";

export const LOGOS_BLOB_STORE = "logos";

export const uploadLogoToStorage = async (file?: File) => {
	if (!file) {
		return;
	}

	const formData = new FormData();
	formData.append("file", file);
	formData.append("store", LOGOS_BLOB_STORE);

	const response = await uploadBlobToStorage({ data: formData });

	return response.key;
};

export const getLogoFromStorage = async (key: string) => {
	const response = await getBlobFromStorage({
		data: {
			key,
			store: LOGOS_BLOB_STORE,
		},
	});

	const blob = await response.blob();
	const file = new File([blob], key, {
		type: blob.type,
	});

	return file;
};

export const deleteLogoFromStorage = async (key?: string | null) => {
	if (!key) {
		return;
	}

	await deleteBlobFromStorage({
		data: { store: LOGOS_BLOB_STORE, key },
	});
};

export const cloneLogoToStorage = async (key: string) => {
	const file = await getLogoFromStorage(key);

	const newKey = await uploadLogoToStorage(file);
	return newKey;
};

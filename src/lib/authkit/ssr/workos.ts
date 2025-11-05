import { WorkOS } from "@workos-inc/node";
import { lazy } from "@/lib/utils/lazy";
import { authkitConfig } from "./config";

function createWorkOSInstance() {
	const options = {
		apiHostname: authkitConfig.apiHostname,
		https: authkitConfig.apiHttps,
		port: authkitConfig.apiPort,
	};

	const workos = new WorkOS(authkitConfig.apiKey, options);
	return workos;
}

export const getWorkOS = lazy(createWorkOSInstance);

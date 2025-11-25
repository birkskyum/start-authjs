import { defineConfig, loadEnv } from "vite";
import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin } from "@solidjs/vite-plugin-nitro-2";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	Object.assign(process.env, env);

	return {
		server: {
			port: Number(process.env.PORT) || 10000,
		},
		plugins: [solidStart(), nitroV2Plugin()],
	};
});

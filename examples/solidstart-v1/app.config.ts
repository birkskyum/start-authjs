import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    server: {
      port: Number(process.env.PORT) || 10000,
    },
  },
});

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const ESBUILD_MODULES_TARGET = [
  "es2020",
  "edge88",
  "firefox78",
  "chrome87",
  // vite default setting is to support safari13
  // https://github.com/vitejs/vite/blob/134ce6817984bad0f5fb043481502531fee9b1db/packages/vite/src/node/constants.ts#L20-L26
  // safari13 doesn't support bigint so we can up the version to 14.
  // https://caniuse.com/bigint
  "safari14",
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    esbuildOptions: {
      target: ESBUILD_MODULES_TARGET,
    },
  },
  build: {
    target: ESBUILD_MODULES_TARGET,
  },
});

import { defineConfig } from "@tanstack/react-start/config";
import mdx from "@mdx-js/rollup";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  vite: {
    plugins: [
      mdx(),
      glsl(),
    ],
  },
});

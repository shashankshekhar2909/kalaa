import { defineConfig } from "tsup";

// JS only. Component CSS is plain CSS with "kl-" prefixed classes, joined into dist/styles.css by
// scripts/css.mjs and exposed as "@kalaa/react/styles.css".
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  external: ["react", "react-dom", "@base-ui/react"],
  banner: { js: '"use client";' },
  sourcemap: true,
  clean: true,
});

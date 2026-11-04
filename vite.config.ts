import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { isBuiltin } from "node:module";

const external = [
  "express",
  "express-session",
  "@kinde-oss/kinde-typescript-sdk",
  "@kinde/jwt-validator",
  "aws-jwt-verify",
];

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      name: "@kinde-oss/kinde-node-express",
      fileName: (format) =>
        `kinde-node-express.${format === "es" ? "mjs" : "cjs"}`,
    },
    target: "esnext",
    outDir: "./dist",
    rolldownOptions: {
      platform: "node",
      external: (id) => isBuiltin(id) || external.includes(id),
      output: {
        globals: {
          "@kinde/jwt-decoder": "jwtDecoder",
          "aws-jwt-verify": "awsJwtVerify",
          dotenv: "dotenv",
        },
      },
    },
  },
  resolve: { alias: { src: resolve(import.meta.dirname, "src") } },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: "./dist",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
    }),
  ],
});

// export default defineConfig([
//   // ESM build
//   {
//     build: {
//       lib: {
//         entry: './src/index.ts',
//         fileName: 'index.esm',
//         formats: ['es'],
//       },
//       outDir: 'dist',
//       emptyOutDir: false,
//       rollupOptions: {
//         external,
//       },
//       sourcemap: true,
//       minify: true,
//     },
//     plugins: [
//       dts({
//         entryRoot: 'src',
//         outDir: 'dist/types',
//         tsConfigFilePath: './tsconfig.json',
//       }),
//     ],
//   },
//   // CJS build
//   {
//     build: {
//       lib: {
//         entry: './src/index.ts',
//         fileName: 'index.cjs',
//         formats: ['cjs'],
//       },
//       outDir: 'dist-cjs',
//       emptyOutDir: false,
//       rollupOptions: {
//         external,
//       },
//       sourcemap: true,
//       minify: true,
//     },
//     plugins: [],
//   },
// ]);

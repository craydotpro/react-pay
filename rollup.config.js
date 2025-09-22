import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2"; // For Typescript
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import tailwindConfig from "./tailwind.config.cjs";
import commonjs from "@rollup/plugin-commonjs";
import dotenv from "rollup-plugin-dotenv";
import replace from "@rollup/plugin-replace";

export default [
  {
    input: "./src/cray-widget/index.tsx",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins: [
      dotenv(),
      replace({
        "import.meta.env?.VITE_API_HOST": "''",
        "import.meta.env?.VITE_GATEWAY_API_KEY": "''",
        "import.meta.env?.VITE_WALLET_KIT_PROJECT_ID": "''",

        // Ensure replacements only apply to whole words to avoid unintended substitutions
        preventAssignment: true,
      }),
      commonjs(),
      postcss({
        config: {
          path: "./postcss.config.js",
        },
        extensions: [".css"],
        minimize: true,
        inject: {
          insertAt: "top",
        },
        plugins: [tailwindcss(tailwindConfig)],
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      external({
        includeDependencies: true,
      }),
      resolve(),
      terser(),
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfig: "./tsconfig.json",
      }),
    ],
  },
];

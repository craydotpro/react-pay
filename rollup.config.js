import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2"; // For Typescript
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import tailwindConfig from "./tailwind.config.cjs";
import commonjs from "@rollup/plugin-commonjs";
export default [
  {
    input: "./src/index.tsx",
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

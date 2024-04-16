import {nodeResolve} from "@rollup/plugin-node-resolve"
//import typescript from '@rollup/plugin-typescript';

export default {
  input: "./editor.mjs",
  output: {
    file: "./editor.bundle.js",
    format: "esm"
  },
  plugins: [nodeResolve()/*, typescript()*/]
}

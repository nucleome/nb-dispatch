import {terser} from "rollup-plugin-terser";
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'

import * as meta from "./package.json";
const config = {
  input: "src/index.js",
  external: Object.keys(meta.dependencies || {}).filter(key => /^nb-/.test(key)),
  output: {
    file: `dist/${meta.name}.js`,
    name: "nb",
    format: "umd",
    indent: false,
    extend: true,
    banner: `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`,
    globals: Object.assign({}, ...Object.keys(meta.dependencies || {}).filter(key => /^nb-/.test(key)).map(key => ({[key]: "nb"})))
  },
    plugins: [
        resolve(),
        commonJS({
            include:'node_modules/**'
        })
    ]
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
  }
];

const path = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { default: babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
const json = require('@rollup/plugin-json');
const clear = require('rollup-plugin-clear');
const { terser } = require('rollup-plugin-terser');
const babelConfig = require('./babel.config');

const __DEV__ = !!process.env.ROLLUP_WATCH;

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

function generateConfig(
  {
    input,
    filename,
    format = 'umd',
    min = false,
  }
) {
  return {
    input,
    output: [
      {
        file: filename,
        format,
        sourcemap: true,
        name: 'DecimalEval',
        exports: 'named'
      },
    ],
    watch: {
      include: 'src/**',
      exclude: 'node_modules/**'
    },
    plugins: [
      clear({ targets: ['dist'] }),
      json(),
      commonjs(),
      babel({
        ...babelConfig,
        babelHelpers: 'runtime',
        extensions
      }),
      nodeResolve({
        extensions
      }),
      replace({
        __VERSION__: `"${require('./package.json').version}"`
      }),
      min && terser({
        output: {
          comments: false
        }
      }),
    ].filter(Boolean)
  };
}

module.exports = [
  // index.js
  generateConfig({
    input: 'src/index.ts',
    filename: 'dist/index.js'
  }),
  // index.min.js
  generateConfig({
    input: 'src/index.ts',
    filename: 'dist/index.min.js',
    min: true
  }),
  // index.esm.js
  !__DEV__ && generateConfig({
    input: 'src/index.ts',
    filename: 'dist/index.esm.js',
    format: 'esm',
  }),
  // pure.js
  !__DEV__ && generateConfig({
    input: 'src/pure.ts',
    filename: 'dist/pure.js'
  }),
  // pure.min.js
  !__DEV__ && generateConfig({
    input: 'src/pure.ts',
    filename: 'dist/pure.min.js',
    min: true
  }),
  // pure.esm.js
  !__DEV__ && generateConfig({
    input: 'src/pure.ts',
    filename: 'dist/pure.esm.js',
    format: 'esm',
  })
].filter(Boolean);

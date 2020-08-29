const path = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const { default: babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
const json = require('@rollup/plugin-json');
const clear = require('rollup-plugin-clear');
const { terser } = require('rollup-plugin-terser');
const babelConfig = require('./babel.config');

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

function generateConfig(
  {
    input,
    filename,
    name,
    min = false,
  }
) {
  return {
    input,
    output: [
      {
        file: filename,
        format: 'umd',
        sourcemap: true,
        name,
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
  generateConfig({
    input: 'src/index.ts',
    filename: 'dist/index.js',
    name: 'DecimalEval',
    min: false
  }),
  generateConfig({
    input: 'src/index.ts',
    filename: 'dist/index.min.js',
    name: 'DecimalEval',
    min: true
  }),
  generateConfig({
    input: 'src/pure.ts',
    filename: 'dist/pure.js',
    name: 'DecimalEvalPure',
    min: false,
  }),
  generateConfig({
    input: 'src/pure.ts',
    filename: 'dist/pure.min.js',
    name: 'DecimalEvalPure',
    min: true
  })
];

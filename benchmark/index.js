const {evaluate} = require('../dist/pure');
const {performance} = require('perf_hooks');
const fs = require('fs');
const path = require('path');

const fixtures = {
  simple: ['1 + 2'],
  complex: ['(+.1 + (-.2) - ((1.0e+2 + (-0.5 / (2. * ((100) - 95)))) * 2)) - 4 / 2.'],
  withScope: ['123.45 + foo', {foo: 99}]
};

const times = 10000;

function run(expr, scope) {
  const start = performance.now();
  let i = 0;
  while (i < times) {
    evaluate(expr, scope);
    i++;
  }
  return performance.now() - start; // ms
}

let result = '' +
  'Benchmark test results (Auto generated):\n' +
  `Run times: ${times}\n\n` +
  'Cases:\n';

Object.keys(fixtures).forEach(key => {
  const cost = run(...fixtures[key]);
  result += `${key}: ${cost}ms\n`;
});

fs.writeFileSync(
  path.join(__dirname, 'result.txt'),
  result
);

console.log('Complete!');


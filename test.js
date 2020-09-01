const {evaluate, Parser, Operator} = require('./dist');

// const expr = `(1 + (323.e2 - .1)) + ?abc`;

// console.log(evaluate(expr))

// const regexp = /\.[0-9][0-9eE]*|[0-9][.0-9eE]*/g;
//
// let i = 1;
// const map = {
//
// }
// const x = expr.replace(regexp, (match) => {
//   return `?${i++}`
// }).replace(/\s/g, '');
//
// const expr = `0.2+2e2`;

var x = evaluate('0.1 + 0.2 + ca3');


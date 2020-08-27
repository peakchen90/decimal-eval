const {evaluate, Parser} = require('./dist');

// const ast = parser.parse();
// console.log(ast);
// const parser = new Parser('(123 - 32)');

const expr = '0.1 + 0.2 * 3';
console.log('\n\n------------ Original Result -------------\n');
console.log(eval(expr));

console.log('\n\n------------ Decimal Result -------------\n');
const value = evaluate(expr);
console.log(value);

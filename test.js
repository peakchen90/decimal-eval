const {evaluate, Parser} = require('./dist');

// const ast = parser.parse();
// console.log(ast);
// const parser = new Parser('(123 - 32)');

// const expr = '(1 - 2) * 3 + (4 - 5 / 6)';
// const expr = '2 - 3 + (5 / 6)';
const expr = '2 - 3 + (5 / 6)';
console.log('\n\n------------ Original Result -------------\n');
console.log(eval(expr));

console.log('\n\n------------ Decimal Result -------------\n');
const value = evaluate(expr);
console.log(value);

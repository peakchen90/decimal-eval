const { evaluate, Parser } = require('./dist');



// const ast = parser.parse();
// console.log(ast);
// const parser = new Parser('(123 - 32)');

function JSEval(expression) {
  return new Function('return Number(' + expression + ')')();
}

// const expr = '(0.1 + 0.2) * 3 + ((4 - ((15))) / 6)';
// const expr = `((30) + 9) / 2.3`;
// const expr = '2 - 3 + 4 / 3 - 4.2e+2 + 32 *+2';
const expr = `1+(2+3)))`;
// const expr = '2 +-(';
// const expr = '1 + 3 * 5';
// const expr = '2 + @';
console.log('\n\n------------ Original Result -------------\n');
// console.log(JSEval(expr));

console.log('\n\n------------ Decimal Result -------------\n');
const value = evaluate(expr);
console.log(value);

import Parser from './parser';
import Operator from './operator';
import {transform} from './transform';
// import {minus, plus, times, div} from './operators';
// Parser.use(plus);
// Parser.use(minus);
// Parser.use(times);
// Parser.use(div);

function evaluate(expression: string): number {
  const ast = new Parser(expression).parse();
  const value = transform(ast);
  return Number(value);
}

export const DecimalEval = {
  evaluate,
  Parser,
  Operator,
  version: __VERSION__
};

export {
  evaluate,
  Parser,
  Operator
};

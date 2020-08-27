import Parser from './parser';
import Operator from './operator';
// import {minus, plus, times, div} from './operators';
// Parser.use(plus);
// Parser.use(minus);
// Parser.use(times);
// Parser.use(div);

function evaluate(expression: string): number {
  new Parser(expression).parse();
  return 0;
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

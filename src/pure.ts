import Parser from './parser';
import Operator, {useOperator} from './operator';
import {useAdapter} from './transform';

declare const __VERSION__: string;

/**
 * 计算表达式
 * @param expression
 * @param scope
 */
function evaluate(expression: string, scope?: Record<string, number>): number {
  return new Parser(expression).compile()(scope);
}

Parser.useOperator = useOperator;
Parser.evaluate = evaluate;
Parser.useAdapter = useAdapter;


const DecimalEval = {
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
export default DecimalEval;

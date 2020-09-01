import Parser from './parser';
import Operator, {useOperator} from './operator';
import {IAdapter, transform} from './transform';

declare const __VERSION__: string;

// 计算方法适配
let _adapter: IAdapter = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right
};

/**
 * 计算表达式
 * @param expression
 */
function evaluate(expression: string): number {
  const node = new Parser(expression).parse();
  if (!node) return 0; // 空字符串
  return transform(node, _adapter) as number;
}

/**
 * 使用指定的计算方法适配器用于计算值
 * @param adapter
 */
function useAdapter(adapter: IAdapter): void {
  const baseOperators = ['+', '-', '*', '/'];
  adapter = adapter || ({} as IAdapter);
  baseOperators.forEach(op => {
    if (typeof adapter[op] !== 'function') {
      throw new Error(`Missing method for calculation operator \`${op}\``);
    }
  });
  _adapter = adapter;
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

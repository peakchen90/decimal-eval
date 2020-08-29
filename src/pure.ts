import Parser from './parser';
import Operator, {use} from './operator';
import {IAdapter, transform} from './transform';

declare const __VERSION__: string;

// 计算方法适配
let _adapter: IAdapter;

/**
 * 计算表达式
 * @param expression
 */
function evaluate(expression: string): number {
  if (!_adapter) {
    throw new Error('Please pass the `Parser.useAdapter()` method to set the calculation adapter firstly.');
  }

  const ast = new Parser(expression).parse();
  if (!ast) return 0; // 空字符串
  const value = transform(ast, _adapter) as number;
  return value;
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

Parser.use = use;
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

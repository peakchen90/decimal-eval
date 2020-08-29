import {Node} from './parser/util';
import {installedOperators} from './operator';

/**
 * 计算方法适配
 */
export interface IAdapter {
  '+': (left: number, right: number) => number;
  '-': (left: number, right: number) => number;
  '*': (left: number, right: number) => number;
  '/': (left: number, right: number) => number;
}

/**
 * 计算
 * @param left
 * @param right
 * @param operator
 */
export function calc(
  adapter: IAdapter,
  left: number,
  right: number,
  operator: string
): number {
  switch (operator) {
    case '+':
    case '-':
    case '*':
    case '/':
      return adapter[operator](left, right);
    default:
      const customOperator = installedOperators.find(op => op.value === operator);
      if (customOperator) {
        return customOperator.calc(left, right);
      }
  }
  throw new Error(`Unexpected operator: ${operator}`);
}

/**
 * 转换 AST -> 计算结果
 * @param node
 */
export function transform(node: Node | number, adapter: IAdapter): Node | number {
  if (node instanceof Node) {
    if (node.type === 'Expression') {
      return transform(node.expression, adapter);
    }
    if (node.type === 'BinaryExpression') {
      return calc(
        adapter,
        transform(node.left, adapter) as number,
        transform(node.right, adapter) as number,
        node.operator
      );
    }
    if (node.type === 'NumericLiteral') {
      return Number(node.value);
    }
    throw new Error(`Unexpected type: ${node.type}`);
  }
  return node;
}


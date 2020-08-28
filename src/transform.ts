import Big from 'big.js';
import {Node} from './parser/util';

export function calc(left: number, right: number, operator: string): Big {
  switch (operator) {
    case '+':
      return new Big(left).plus(right);
    case '-':
      return new Big(left).minus(right);
    case '*':
      return new Big(left).times(right);
    case '/':
      return new Big(left).div(right);
    default:
      throw new Error('Unexpected operator');
  }
}

export function transform(node: Node | number): Node | Big | number {
  if (node instanceof Node) {
    if (node.type === 'Expression') {
      return transform(node.expression);
    }
    if (node.type === 'BinaryExpression') {
      return calc(
        transform(node.left) as number,
        transform(node.right) as number,
        node.operator
      );
    }
    if (node.type === 'NumericLiteral') {
      return Number(node.value);
    }
    throw new Error('Unexpected node');
  }
  return node;
}


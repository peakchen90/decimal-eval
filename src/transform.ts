import Big from 'big.js';
import {Node} from './parser/util';

export function calc(left, right, operator): Big {
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

export function transform(node): Node | Big | string {
  if (node instanceof Node) {
    if (node.type === 'Expression') {
      return transform(node.expression);
    }
    if (node.type === 'BinaryExpression') {
      return calc(
        transform(node.left),
        transform(node.right),
        node.operator
      );
    }
    if (node.type === 'NumericLiteral') {
      return node.value;
    }
    throw new Error('Unexpected node');
  }
  return node;
}


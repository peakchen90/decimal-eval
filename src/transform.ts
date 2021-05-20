import {Node} from './parser/util';
import Operator, {installedOperators, UnaryCalcMethod} from './operator';

/**
 * 二元表达式计算方法适配器
 */
export interface IAdapter {
  '+': (left: string, right: string) => string;
  '-': (left: string, right: string) => string;
  '*': (left: string, right: string) => string;
  '/': (left: string, right: string) => string;
}

// 计算方法适配
export let _adapter: IAdapter = {
  '+': (left, right) => String(Number(left) + Number(right)),
  '-': (left, right) => String(Number(left) - Number(right)),
  '*': (left, right) => String(Number(left) * Number(right)),
  '/': (left, right) => String(Number(left) / Number(right)),
};

/**
 * 使用指定的计算方法适配器用于计算值
 * @param adapter
 */
export function useAdapter(adapter: IAdapter): void {
  const baseOperators = ['+', '-', '*', '/'];
  adapter = adapter || ({} as IAdapter);
  baseOperators.forEach(op => {
    if (typeof adapter[op] !== 'function') {
      throw new Error(`Missing method for calculation operator \`${op}\``);
    }
  });
  _adapter = adapter;
}

/**
 * 二元表达式计算
 * @param left
 * @param right
 * @param operator
 */
export function binaryCalculation(
  left: string,
  right: string,
  operator: string
): string {
  switch (operator) {
    case '+':
    case '-':
    case '*':
    case '/':
      return _adapter[operator](left, right);
    default:
      for (let i = 0; i < installedOperators.length; i++) {
        const op = installedOperators[i];
        if (op.type.isBinary && op.value === operator) {
          return op.calc(left, right);
        }
      }
  }
  /* istanbul ignore next */
  throw new Error(`Unexpected binary operator: ${operator}`);
}

/**
 * 一元表达式计算
 * @param value
 * @param operator
 */
export function unaryCalculation(value: string, operator: string): string {
  switch (operator) {
    case '+':
      return value;
    case '-':
      return String(-value);
    default:
      for (let i = 0; i < installedOperators.length; i++) {
        const op = installedOperators[i] as Operator<UnaryCalcMethod>;
        if (op.type.isPrefix && op.value === operator) {
          return op.calc(value);
        }
      }
  }
  /* istanbul ignore next */
  throw new Error(`Unexpected unary operator: ${operator}`);
}

/**
 * 转换 AST -> 计算结果
 * @param node
 * @param scope
 */
export function transform(node: Node | string, scope: Record<string, number | string> = {}): Node | string {
  if (node instanceof Node) {
    let scopeValue;
    switch (node.type) {
      case 'Expression':
        return transform(node.expression, scope);
      case 'BinaryExpression':
        return binaryCalculation(
          transform(node.left, scope) as string,
          transform(node.right, scope) as string,
          node.operator
        );
      case 'UnaryExpression':
        return unaryCalculation(
          transform(node.argument, scope) as string,
          node.operator
        );
      case 'NumericLiteral':
        if (node.radix === 10) {
          return node.value;
        }
        return parseInt(node.value, node.radix).toString();
      case 'Identifier':
        scopeValue = scope[node.name];
        if (scopeValue === undefined) {
          throw new Error(`The scope \`${node.name}\` corresponding value was not found`);
        }
        return String(scopeValue);
      default:
        /* istanbul ignore next */
        throw new Error(`Unexpected type: ${node.type}`);
    }
  }
  return node;
}

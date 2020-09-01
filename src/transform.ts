import {Node} from './parser/util';
import {installedOperators, IOperator, UnaryCalcMethod} from './operator';

/**
 * 二元表达式计算方法适配器
 */
export interface IAdapter {
  '+': (left: number, right: number) => number;
  '-': (left: number, right: number) => number;
  '*': (left: number, right: number) => number;
  '/': (left: number, right: number) => number;
}

// 计算方法适配
export let _adapter: IAdapter = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right
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
  left: number,
  right: number,
  operator: string
): number {
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
export function unaryCalculation(value: number, operator: string): number {
  switch (operator) {
    case '+':
      return value;
    case '-':
      return -value;
    default:
      for (let i = 0; i < installedOperators.length; i++) {
        const op = installedOperators[i] as IOperator<UnaryCalcMethod>;
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
export function transform(node: Node | number, scope: Record<string, number> = {}): Node | number {
  if (node instanceof Node) {
    let scopeValue;
    switch (node.type) {
      case 'Expression':
        return transform(node.expression, scope);
      case 'BinaryExpression':
        return binaryCalculation(
          transform(node.left, scope) as number,
          transform(node.right, scope) as number,
          node.operator
        );
      case 'UnaryExpression':
        return unaryCalculation(
          transform(node.argument, scope) as number,
          node.operator
        );
      case 'NumericLiteral':
        return Number(node.value);
      case 'Identifier':
        scopeValue = scope[node.name];
        if (scopeValue === undefined) {
          throw new Error(`The scope \`${node.name}\` corresponding value was not found`);
        }
        return Number(scopeValue);
      default:
        /* istanbul ignore next */
        throw new Error(`Unexpected type: ${node.type}`);
    }
  }
  return Number(node);
}

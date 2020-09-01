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

/**
 * 二元表达式计算
 * @param adapter
 * @param left
 * @param right
 * @param operator
 */
export function binaryCalculation(
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
 * @param adapter
 * @param placeholderMap
 */
export function transform(node: Node | number, adapter: IAdapter, placeholderMap: Record<string, string> = {}): Node | number {
  if (node instanceof Node) {
    let placeholder;
    switch (node.type) {
      case 'Expression':
        return transform(node.expression, adapter, placeholderMap);
      case 'BinaryExpression':
        return binaryCalculation(
          adapter,
          transform(node.left, adapter, placeholderMap) as number,
          transform(node.right, adapter, placeholderMap) as number,
          node.operator
        );
      case 'UnaryExpression':
        return unaryCalculation(
          transform(node.argument, adapter, placeholderMap) as number,
          node.operator
        );
      case 'NumericLiteral':
        return Number(node.value);
      case 'Placeholder':
        placeholder = placeholderMap[node.placeholder];
        /* istanbul ignore next */
        if (!placeholder) {
          throw new Error(`The placeholder ${node.placeholder} not found`);
        }
        return Number(placeholder);
      default:
        /* istanbul ignore next */
        throw new Error(`Unexpected type: ${node.type}`);
    }
  }
  return Number(node);
}

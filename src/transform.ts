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
      const customOperator = installedOperators.find(op => {
        return op.type.isBinary && op.value === operator;
      });
      if (customOperator) {
        return customOperator.calc(left, right);
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
      const customOperator = installedOperators.find(op => {
        return op.type.prefix && op.value === operator;
      }) as IOperator<UnaryCalcMethod>;
      if (customOperator) {
        return customOperator.calc(value);
      }
  }
  /* istanbul ignore next */
  throw new Error(`Unexpected unary operator: ${operator}`);
}

/**
 * 转换 AST -> 计算结果
 * @param node
 */
export function transform(node: Node | number, adapter: IAdapter): Node | number {
  if (node instanceof Node) {
    switch (node.type) {
      case 'Expression':
        return transform(node.expression, adapter);
      case 'BinaryExpression':
        return binaryCalculation(
          adapter,
          transform(node.left, adapter) as number,
          transform(node.right, adapter) as number,
          node.operator
        );
      case 'UnaryExpression':
        return unaryCalculation(
          transform(node.argument, adapter) as number,
          node.operator
        );
      case 'NumericLiteral':
        return Number(node.value);
      default:
        throw new Error(`Unexpected type: ${node.type}`);
    }
  }
  return Number(node);
}

import {TokenType} from './parser/token-type';

export interface IOperator {
  value: string;
  code: number[];
  type: TokenType;
  calc: (left: number, right: number) => number;
}

// 保留字符
const reserved = ['+', '-', '*', '/', '(', ')'];

/**
 * 注册的所有自定义运算符
 */
export const installedOperators: IOperator[] = [];

/**
 * 注册自定义运算符
 * @param operator
 */
export function use(operator: IOperator): void {
  if (reserved.includes(operator.value)) {
    throw new Error(`Cannot use reserved char, including: ${reserved.join(', ')}`);
  }
  if (!installedOperators.includes(operator)) {
    installedOperators.unshift(operator); // 注册相同运算符，保证后面的运算符覆盖前面的
  }
}

export default class Operator {
  /**
   * 创建运算符
   * @param value 运算符的值
   * @param precedence 优先级大小
   * @param calc 计算方法
   * @see 运算符优先级参考: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
   */
  static create(
    value: string,
    precedence: number,
    calc: (left: number, right: number) => number
  ): IOperator {
    if (typeof value !== 'string' || !/^\S+$/.test(value)) {
      throw new Error('The value should be a non-empty string');
    }
    return {
      type: new TokenType(value, {
        isOperator: true,
        precedence
      }),
      value,
      code: value.split('').map((_, i) => value.charCodeAt(i)),
      calc
    };
  }
}


import {TokenType} from './parser/token-type';
import {isNumericStart} from './parser/util';

export type BinaryCalcMethod = (left: number, right: number) => number;
export type UnaryCalcMethod = (value: number) => number;

export interface IOperator<M extends BinaryCalcMethod | UnaryCalcMethod = BinaryCalcMethod> {
  value: string;
  codes: number[];
  type: TokenType;
  calc: M;
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
export function useOperator(operator: IOperator): void {
  if (!installedOperators.includes(operator)) {
    installedOperators.unshift(operator); // 注册相同运算符，保证后面注册的覆盖前面的
  }
}

export default class Operator {
  static mod?: IOperator<BinaryCalcMethod>
  static pow?: IOperator<BinaryCalcMethod>
  static abs?: IOperator<UnaryCalcMethod>

  /**
   * 创建运算符
   * @param value 运算符的值
   * @param precedence 运算符优先级
   * @param calc 计算方法
   * @param isPrefix 是否可以作为前缀（一元运算符，仅支持运算符在左侧，计算方法 `calc` 只接收一个参数）
   * @see 运算符优先级参考: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
   */
  static create<M extends BinaryCalcMethod | UnaryCalcMethod>(
    value: string,
    precedence: number,
    calc: M,
    isPrefix = false
  ): IOperator<M> {
    if (typeof value !== 'string' || !/^\S+$/.test(value)) {
      throw new Error('The custom operator should be a non-empty string');
    }
    if (reserved.includes(value)) {
      throw new Error(`The custom operator cannot use reserved character, including: ${reserved.join(', ')}`);
    }
    if (isNumericStart(value.charCodeAt(0))) {
      throw new Error('The custom operator cannot start with a possible number, including: `.`, 0-9');
    }
    if (precedence != null && (typeof precedence !== 'number' || precedence < 0)) {
      throw new Error('The precedence should be a number greater than 0');
    }
    if (typeof calc !== 'function') {
      throw new Error(
        `Expected to receive a calculation method, like: \`${
          isPrefix
            ? '(value) => -value'
            : '(left, right) => left + right'
        }\``
      );
    }

    return {
      type: new TokenType(value, {
        isBinary: !isPrefix,
        isPrefix,
        precedence,
      }),
      value,
      codes: value.split('').map((_, i) => value.charCodeAt(i)),
      calc
    };
  }
}

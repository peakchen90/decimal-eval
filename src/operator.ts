import {TokenType} from './parser/token-type';
import {isNumericStart} from './parser/util';

export type BinaryCalcMethod = (left: string, right: string) => string;
export type UnaryCalcMethod = (value: string) => string;
export type OperatorMethod = BinaryCalcMethod | UnaryCalcMethod;

// 保留字符
const reserved: Readonly<string[]> = ['+', '-', '*', '/', '(', ')'];

/**
 * 注册的所有自定义运算符
 */
export const installedOperators: Operator[] = [];

/**
 * 注册自定义运算符
 * @param operator
 */
export function useOperator(operator: Operator): void {
  if (!installedOperators.includes(operator)) {
    installedOperators.unshift(operator); // 注册相同运算符，保证后面注册的覆盖前面的
  }
}

/**
 * 检查参数
 * @param value
 * @param precedence
 */
function checkCreateArgs(value, precedence) {
  if (typeof value !== 'string' || !/^\S+$/.test(value)) {
    throw new Error('The custom operator should be a non-empty string');
  }
  if (reserved.includes(value)) {
    throw new Error(`The custom operator cannot use reserved character, including: ${reserved.join(', ')}`);
  }
  if (isNumericStart(value.charCodeAt(0))) { // 0-9, `.`
    throw new Error('The custom operator cannot start with a possible number, including: `.`, 0-9');
  }
  if (value.charCodeAt(0) === 63) { // `?`
    throw new Error('The custom operator cannot start with `?`');
  }
  if (precedence != null && (typeof precedence !== 'number' || precedence < 0)) {
    throw new Error('The precedence should be a number greater than 0');
  }
}

/**
 * 运算符
 */
export default class Operator<M extends OperatorMethod = BinaryCalcMethod> {
  readonly value: string;
  readonly codes: number[];
  readonly type: TokenType;
  readonly calc: M

  constructor(value: string, precedence: number, calc: M, isUnary = false) {
    this.value = value;
    this.codes = value.split('').map((_, i) => value.charCodeAt(i));
    this.type = new TokenType(value, {
      isBinary: !isUnary,
      isPrefix: isUnary,
      precedence,
    });
    this.calc = calc;
  }
}


/**
 * 创建一个二元运算符
 * @param value
 * @param precedence
 * @param calc
 * @see 运算符优先级参考: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 */
export function createBinaryOperator(value: string, precedence: number, calc: BinaryCalcMethod): Operator {
  checkCreateArgs(value, precedence);
  if (typeof calc !== 'function') {
    throw new Error('Expected to receive a calculation method, like: `(left, right) => String(left - right)`');
  }
  return new Operator<BinaryCalcMethod>(value, precedence, calc, false);
}

/**
 * 创建一个一元运算符
 * @param value
 * @param precedence
 * @param calc
 * * @see 运算符优先级参考: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 */
export function createUnaryOperator(value: string, precedence: number, calc: UnaryCalcMethod): Operator {
  checkCreateArgs(value, precedence);
  if (typeof calc !== 'function') {
    throw new Error('Expected to receive a calculation method, like: `(value) => String(Math.abs(value))`');
  }
  return new Operator<UnaryCalcMethod>(value, precedence, calc, true);
}

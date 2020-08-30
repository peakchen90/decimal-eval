import {evaluate} from './pure';
import Big from 'big.js';

class Decimal {
  /**
   * 计算表达式，返回 Decimal 对象
   * @param expression
   */
  static evaluate(expression: string): Decimal {
    const value = evaluate(expression);
    return new this(value);
  }

  /**
   * 原始数值
   */
  value: number;
  /**
   * 原始值的 Big 对象
   */
  bigValue: Big;

  /**
   * constructor
   * @param value 原始数值
   */
  constructor(value: number) {
    this.value = Number(value);
    this.bigValue = new Big(this.value);
  }

  /**
   * 与 Number.prototype.toFixed 方法一致，修复精度问题
   * @param digits
   */
  toFixed(digits = 0): string {
    return this.bigValue.toFixed(digits);
  }

  /**
   * 返回字符串(隐式转换调用)
   */
  toString(): string {
    return String(this.value);
  }

  /**
   * 返回数字
   */
  toNumber(): number {
    return this.value;
  }

  /**
   * 返回原始数字(隐式转换调用)
   */
  valueOf(): number {
    return this.toNumber();
  }
}

export default Decimal;

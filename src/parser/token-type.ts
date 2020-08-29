export interface ITokenTypeOptions {
  isOperator?: boolean; // 是否是运算符
  precedence?: number; // 运算符优先级
}

export class TokenType {
  /**
   * Token label
   */
  label: string
  /**
   * 是否标识符
   */
  isOperator: boolean
  /**
   * 优先级，
   * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
   */
  precedence: number

  /**
   * constructor
   * @param label
   * @param options
   */
  constructor(label: string, options: ITokenTypeOptions = {}) {
    this.label = label;
    this.isOperator = !!options.isOperator;
    this.precedence = options.precedence ?? -1;
  }
}

export const tokenTypes = {
  parenL: new TokenType('('),
  parenR: new TokenType(')'),
  end: new TokenType('end'),
  numeric: new TokenType('numeric'),
  plus: new TokenType('+', {isOperator: true, precedence: 13}),
  minus: new TokenType('-', {isOperator: true, precedence: 13}),
  times: new TokenType('*', {isOperator: true, precedence: 14}),
  div: new TokenType('/', {isOperator: true, precedence: 14})
};

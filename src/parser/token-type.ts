export interface ITokenTypeOptions {
  isBinary?: boolean; // 是否为二元元运算符
  prefix?: boolean; // 是否可以作为前缀（一元运算符，仅支持运算符在左侧）
  precedence?: number; // 运算符优先级
}

export class TokenType {
  /**
   * Token label
   */
  label: string
  /**
   * 是否为二元运算符
   */
  isBinary: boolean
  /**
   * 是否可以作为前缀（一元运算符，仅支持运算符在左侧）
   */
  prefix: boolean
  /**
   * 运算符优先级
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
    this.isBinary = !!options.isBinary;
    this.prefix = !!options.prefix;
    this.precedence = options.precedence ?? -1;
  }
}

export const tokenTypes = {
  parenL: new TokenType('('),
  parenR: new TokenType(')'),
  end: new TokenType('end'),
  numeric: new TokenType('numeric'),
  plus: new TokenType('+', {isBinary: true, precedence: 13}),
  minus: new TokenType('-', {isBinary: true, precedence: 13}),
  times: new TokenType('*', {isBinary: true, precedence: 14}),
  div: new TokenType('/', {isBinary: true, precedence: 14}),
  prefixPlus: new TokenType('+', {prefix: true, precedence: 16}),
  prefixMinus: new TokenType('-', {prefix: true, precedence: 16})
};

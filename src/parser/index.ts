import {TokenType, tokenTypes, tokenTypes as tt} from './token-type';
import {isNumericStart, isNumericChar, Node, NodeType, isIdentifierChar, isIdentifierStart, getNumericRadix, getNumericRawData} from './util';
import Operator, {BinaryCalcMethod, installedOperators, UnaryCalcMethod} from '../operator';
import {IAdapter, transform} from '../transform';

/**
 * AST Parser
 */
export default class Parser {
  readonly input: string // 输入的解析字符串
  node: Node | null | undefined // 解析后的 AST 节点
  pos: number // 当前位置
  tokenType: TokenType // 当前 Token 的类型
  value: string  // 当前 Token 的值
  start: number // 当前 Token 的开始位置
  end: number // 当前 Token 的结束位置
  lastTokenStart: number // 上一个 Token 的开始位置
  lastTokenEnd: number // 上一个 Token 的结束位置
  allowPrefix: boolean // 当前上下文是否允许前缀

  // pubic static method
  static useOperator: (operator: Operator<BinaryCalcMethod | UnaryCalcMethod>) => void
  static useAdapter: (adapter: IAdapter) => void

  static evaluate(expression: string, scope?: Record<string, number>): string {
    return new Parser(expression).compile()(scope);
  }

  // internal static
  static readonly Node = Node
  static readonly TokenType = TokenType
  static readonly tokenTypes = tokenTypes
  static readonly installedOperators: Operator[] = installedOperators

  /**
   * 解析的字符串
   * @param input
   */
  constructor(input: string) {
    this.input = String(input);
    this.tokenType = tt.start;
    this.value = '';
    this.pos = 0;
    this.start = 0;
    this.end = 0;
    this.lastTokenStart = 0;
    this.lastTokenEnd = 0;
    this.allowPrefix = true;
  }

  /**
   * 编译表达式
   */
  compile(): (scope?: Record<string, number>) => string {
    let node = this.node;
    if (node === undefined) {
      node = this.parse();
    }
    return (scope?: Record<string, number>): string => {
      if (!node) return '0';
      return transform(node, scope ?? {}) as string;
    };
  }

  /**
   * 开始解析，如果是空字符串返回 `null`
   */
  parse(): Node | null {
    this.next();
    const node = this.startNode(this.start);
    if (this.tokenType === tt.end) {
      return this.node = null; // 空字符
    }

    node.expression = this.parseExpression();
    if (this.tokenType !== tt.end) { // 其后遇到其他非法字符
      this.unexpected(this.value);
    }
    return this.node = this.finishNode(node, 'Expression');
  }

  /**
   * 解析表达式
   */
  parseExpression(): Node {
    return this.parseExprAtom(this.start, -1);
  }

  /**
   * 解析一个表达式原子, 如: `1 + 2`、`(1 + 2 + 3)`、`1` 都作为一个表达式原子解析
   * @param leftStartPos 左侧开始位置
   * @param minPrecedence 当前上下文的优先级
   */
  parseExprAtom(leftStartPos: number, minPrecedence: number): Node {
    if (this.tokenType === tt.parenL) { // 遇到 `(` 则递归解析表达式原子
      this.next();
      const left = this.parseExprAtom(this.start, -1);
      this.expect(tt.parenR);
      return this.parseExprOp(left, leftStartPos, minPrecedence); // 将 `(expr)` 整体作为左值，进入优先级解析流程
    } else {
      const left = this.parseMaybeUnary(minPrecedence);
      return this.parseExprOp(left, leftStartPos, minPrecedence); // 读取一个数字作为左值，进入优先级解析流程
    }
  }

  /**
   * 解析二元表达式优先级
   * @param left 左值
   * @param leftStartPos 左值节点起始位置
   * @param minPrecedence 当前上下文的优先级
   */
  parseExprOp(
    left: Node,
    leftStartPos: number,
    minPrecedence: number
  ): Node {
    const precedence = this.tokenType.precedence;
    if (this.tokenType.isBinary && precedence > minPrecedence) { // 比较当前运算符与上下文优先级
      const node = this.startNode(leftStartPos);
      const operator = this.value;
      this.next();

      // 解析可能更高优先级的右侧表达式，如: `1 + 2 * 3` 将解析 `2 * 3` 作为右值
      const start = this.start;
      const maybeHighPrecedenceExpr = this.parseExprAtom(start, precedence);
      const right = this.parseExprOp(maybeHighPrecedenceExpr, start, precedence);
      node.left = left;
      node.operator = operator;
      node.right = right;
      this.finishNode(node, 'BinaryExpression');

      // 将已经解析的二元表达式作为左值，然后递归解析后面可能的同等优先级或低优先级的表达式作为右值
      // 如: `1 + 2 + 3`, 当前已经解析 `1 + 2`, 然后将该节点作为左值递归解析表达式优先级
      return this.parseExprOp(node, leftStartPos, minPrecedence);
    }
    return left;
  }

  /**
   * 解析可能带前缀的表达式，如: `+1`, `-(2)`, `3`, `-(3 + 4)`, `+-+5`
   * @param minPrecedence 当前上下文的优先级
   */
  parseMaybeUnary(minPrecedence: number): Node {
    const precedence = this.tokenType.precedence;
    const node = this.startNode();
    const start = this.start;
    const value = this.value;

    // Note: `1 ++ 1` 会当作 `1 + (+1)` 对待，与 JS 会作为 `1++` 对待不同
    if (this.tokenType.isPrefix) {
      if (precedence >= minPrecedence) { // 相同优先级的一元运算符可以连续
        node.operator = value;
        node.prefix = true;
        this.next();
        node.argument = this.parseExprAtom(this.start, precedence);
        return this.finishNode(node, 'UnaryExpression');
      }
    }

    if (this.tokenType === tt.numeric) {
      const rawData = getNumericRawData(value);
      node.value = rawData.value;
      node.rawValue = rawData.rawValue;
      node.radix = rawData.radix;
      this.next();
      return this.finishNode(node, 'NumericLiteral');
    }

    if (this.tokenType === tt.identifier) {
      node.name = value;
      this.next();
      return this.finishNode(node, 'Identifier');
    }

    return this.unexpected(value, start);
  }

  /**
   * 读取并移到下一个 Token
   */
  next(): void {
    this.lastTokenStart = this.start;
    this.lastTokenEnd = this.end;
    this.skipSpace();

    this.start = this.pos;
    if (this.pos >= this.input.length) {
      if (this.tokenType === tt.end) return;
      this.finishToken(tt.end);
    } else {
      this.readToken();
    }
  }

  /**
   * 读取一个 token
   */
  readToken(): void {
    const code = this.codeAt(this.pos);
    if (isNumericStart(code)) {
      const radix = getNumericRadix(this.input, this.pos);
      if (radix === 10) {
        return this.readNumeric();
      }
      return this.readNumericWithRadix(radix);
    }
    return this.readTokenFromCode();
  }

  /**
   * 读取一个数字
   */
  readNumeric(): void {
    const chunkStart = this.pos;
    let countE = -1; // 统计字符 `e` 出现次数，-1 表示当前位置不允许出现 `e`
    let allowDot = true;
    let allowUnderline = false;
    let expectANumber = false; // 是否期望字符是数字
    let unexpectedPos = -1;

    while (this.isValidPosition()) {
      const code = this.codeAt(this.pos);

      if (isNumericChar(code)) { // 0-9
        if (countE === -1) {
          countE = 0;
        }
        this.pos++;
        expectANumber = false;
        allowUnderline = true;
      } else if (expectANumber) {
        unexpectedPos = this.pos;
        expectANumber = false;
        break;
      } else if (code === 69 || code === 101) { // `E` / `e`
        if (countE !== 0) {
          unexpectedPos = this.pos;
          break;
        }

        countE++;
        this.pos++;
        if (
          this.isValidPosition() &&
          (this.codeAt(this.pos) === 43 || this.codeAt(this.pos) === 45) // `+` / `-`
        ) {
          this.pos++;
        }
        allowDot = false;
        expectANumber = true;
      } else if (code === 46) { // `.`
        if (!allowDot) {
          unexpectedPos = this.pos;
          break;
        }

        allowDot = false;
        this.pos++;
        if (this.pos - chunkStart === 1) {
          expectANumber = true;
        }
      } else if (code === 95) { // `_`
        if (!allowUnderline) {
          unexpectedPos = this.pos;
          break;
        }

        allowUnderline = false;
        expectANumber = true;
        this.pos++;
      } else {
        break;
      }
    }

    if (expectANumber) {
      unexpectedPos = this.pos - 1;
    }
    if (unexpectedPos >= 0) {
      this.unexpected(this.input[unexpectedPos], unexpectedPos);
    }

    const value = this.input.slice(chunkStart, this.pos);
    this.finishToken(tt.numeric, value);
  }

  /**
   * 读取一个非十进制数字
   * @param radix
   */
  readNumericWithRadix(radix: number): void {
    const chunkStart = this.pos;
    let allowUnderline = false;
    let unexpectedPos = -1;
    this.pos += 2;

    while (this.isValidPosition()) {
      const code = this.codeAt(this.pos);

      if (
        (radix === 2 && (code >= 48 && code <= 49)) || // 0-1
        (radix === 8 && (code >= 48 && code <= 55)) || // 0-7
        (radix === 16 && (
          isNumericStart(code) || // 0-9
          (code >= 65 && code <= 70) || // A-F
          (code >= 97 && code <= 102)  // a-f
        ))
      ) {
        allowUnderline = true;
        this.pos++;
      } else if (code === 95) { // `_`
        if (!allowUnderline) {
          unexpectedPos = this.pos;
          break;
        }
        allowUnderline = false;
        this.pos++;
      } else {
        break;
      }
    }

    if (isIdentifierStart(this.codeAt(this.pos))) {
      unexpectedPos = this.pos;
    } else if (this.pos - chunkStart === 2) {
      unexpectedPos = this.pos;
    }
    if (unexpectedPos >= 0) {
      this.unexpected(this.input[unexpectedPos], unexpectedPos);
    }

    const value = this.input.slice(chunkStart, this.pos);
    this.finishToken(tt.numeric, value);
  }

  /**
   * 根据字符 code 读取一个 Token，包括自定义注册的运算符
   */
  readTokenFromCode(): void {
    const code = this.codeAt(this.pos);

    // 优先解析自定义运算符
    let operator, i, j;
    for (i = 0; i < installedOperators.length; i++) {
      const op = installedOperators[i];
      for (j = 0; j < op.codes.length; j++) {
        if (op.codes[j] !== this.codeAt(this.pos + j)) break;
      }
      if (j === op.codes.length) {
        operator = op;
        break;
      }
    }
    if (operator) {
      this.pos += operator.codes.length;
      return this.finishToken(operator.type, operator.value);
    }

    switch (code) {
      case 40: // `(`
        this.pos++;
        return this.finishToken(tt.parenL, '(');
      case 41: // `)`
        this.pos++;
        return this.finishToken(tt.parenR, ')');
      case 42: // `*`
        this.pos++;
        return this.finishToken(tt.times, '*');
      case 43: // `+`
        this.pos++;
        if (this.allowPrefix) {
          return this.finishToken(tt.prefixPlus, '+');
        }
        return this.finishToken(tt.plus, '+');
      case 45: // `-`
        this.pos++;
        if (this.allowPrefix) {
          return this.finishToken(tt.prefixMinus, '-');
        }
        return this.finishToken(tt.minus, '-');
      case 47: // `/`
        this.pos++;
        return this.finishToken(tt.div, '/');
      default:
        if (isIdentifierStart(code)) {
          return this.readIdentifier();
        }
    }

    this.unexpected(this.input[this.pos]);
  }

  /**
   * 读取一个 scope 变量 Token
   */
  readIdentifier(): void {
    const chunkStart = this.pos;
    while (this.isValidPosition()) {
      const code = this.codeAt(this.pos);
      if (isIdentifierChar(code)) {
        this.pos++;
      } else {
        break;
      }
    }
    const value = this.input.slice(chunkStart, this.pos);
    this.finishToken(tt.identifier, value);
  }

  /**
   * 完善一个 Token
   * @param type
   * @param value
   */
  finishToken(type: TokenType, value = ''): void {
    const prevType = this.tokenType;
    this.end = this.pos;
    this.tokenType = type;
    this.value = value;

    this.updateContext(prevType);
  }

  /**
   * 读取 Token 完成后更新上下文
   * @param prevType
   */
  updateContext(prevType: TokenType): void {
    const type = this.tokenType;
    if (type.isBinary || type.isPrefix) {
      this.allowPrefix = true;
    } else if (type.updateContext) {
      type.updateContext.call(this, prevType);
    }
  }

  codeAt(index: number): number {
    return this.input.charCodeAt(index);
  }

  isValidPosition(): boolean {
    return this.pos < this.input.length;
  }

  /**
   * 在当前位置创建一个新节点
   */
  startNode(pos?: number): Node {
    return new Node(pos ?? this.start);
  }

  /**
   * 完善一个节点
   * @param node
   * @param type
   */
  finishNode(node: Node, type: NodeType): Node {
    node.type = type;
    node.end = this.lastTokenEnd;
    return node;
  }

  /**
   * 跳过空白字符
   */
  skipSpace(): void {
    while (this.isValidPosition()) {
      const code = this.codeAt(this.pos);
      if (code === 32 || code === 160) { // ` `
        this.pos++;
      } else if (code === 13 || code === 10 || code === 8232 || code === 8233) { // new line
        if (code === 13 && this.codeAt(this.pos + 1) === 10) { // CRLF
          this.pos++;
        }
        this.pos++;
      } else if (code > 8 && code < 14) { // 制表符等
        this.pos++;
      } else {
        break;
      }
    }
  }

  /**
   * 消费当前指定类型的 token，否则抛出异常
   * @param type
   */
  expect(type: TokenType): void {
    if (!this.eat(type)) {
      this.unexpected(this.value);
    }
  }

  /**
   * 消费一个 token，如果是指定的 token 类型，则移动到下一个 token ，返回 true，否则返回 false
   * @param type
   */
  eat(type: TokenType): boolean {
    if (this.tokenType === type) {
      this.next();
      return true;
    }
    return false;
  }

  /**
   * 抛出 Unexpected token 异常
   * @param token
   * @param pos
   */
  unexpected(token = '', pos?: number): never {
    this.raise(pos ?? this.start, `Unexpected token ${token}`);
  }

  /**
   * 抛出异常
   * @param pos
   * @param message
   */
  raise(pos: number, message: string): never {
    if (pos > this.input.length - 1) {
      message = 'Unexpected end of input';
    } else {
      message += ` at position ${pos}`;
    }
    throw new SyntaxError(message);
  }
}

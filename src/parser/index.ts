import {TokenType, tokenTypes as tt} from './token-type';
import {isNumericStart, isNumericChar, Position, Node} from './util';
import {installedOperators} from '../operator';

/**
 * AST Parser
 */
export default class Parser {
  input: string
  type: TokenType
  value: string
  pos: number
  currLine: number
  lineStart: number
  start: number
  end: number
  startLoc: Position
  endLoc: Position

  static use: Function
  static evaluate: Function
  static useAdapter: Function

  /**
   * 解析的字符串
   * @param input
   */
  constructor(input: string) {
    this.input = input;
    this.type = tt.end;
    this.value = '';
    this.pos = 0;
    this.currLine = 1;
    this.lineStart = 0;
    this.start = 0;
    this.end = 0;
    this.startLoc = this.currPosition();
    this.endLoc = this.currPosition();
  }

  /**
   * 开始解析，如果是空字符串返回 null
   */
  parse(): Node | null {
    const node = this.startNode();
    this.next();
    if (this.type === tt.end) return null; // 空字符

    node.expression = this.parseExpression();
    if (this.type !== tt.end) { // 其后遇到其他非法字符
      this.raise(this.pos, this.value);
    }
    return this.finishNode(node, 'Expression');
  }

  /**
   * 解析表达式
   */
  parseExpression(): Node {
    return this.parseExprAtom();
  }

  /**
   * 解析一个表达式原子, 如: 1+2、(1+2+3)、1 都作为一个表达式原子解析
   * @param minPrecedence
   */
  parseExprAtom(minPrecedence = -1): any {
    let left;
    if (this.type === tt.parenL) {
      this.next();
      left = this.parseExprAtom();
      this.expect(tt.parenR);
      return this.parseExprOp(left, 0, 0, minPrecedence);
    } else {
      left = this.parseMaybePrefixNumeric();
      return this.parseExprOp(left, 0, 0, minPrecedence);
    }
  }

  /**
   * 解析二元表达式优先级
   * @param left
   * @param leftStartPos
   * @param leftStartLoc
   * @param minPrecedence
   */
  parseExprOp(left, leftStartPos, leftStartLoc, minPrecedence): Node {
    const precedence = this.type.precedence;
    if (this.type.isOperator && this.type.precedence > minPrecedence) {
      const node = this.startNode();
      const operator = this.value;
      this.next();
      const maybeHighPrecedenceExpr = this.parseExprAtom(precedence);
      const right = this.parseExprOp(maybeHighPrecedenceExpr, 0, 0, precedence);
      node.left = left;
      node.operator = operator;
      node.right = right;
      this.finishNode(node, 'BinaryExpression');
      return this.parseExprOp(node, 0, 0, minPrecedence);
    }
    return left;
  }

  /**
   * 解析可能带前缀的数字节点，如: +1, -2, 3
   */
  parseMaybePrefixNumeric(): Node {
    const node = this.startNode();
    let prefix = '';
    if (this.type === tt.plus || this.type === tt.minus) { // with prefix `+` or `-`
      prefix = this.value;
      this.next();
    }
    if (this.type !== tt.numeric) {
      this.raise(this.pos, `Unexpected token: ${this.value}`);
    }
    node.value = prefix + this.value;
    this.finishNode(node, 'NumericLiteral');
    this.next();
    return node;
  }

  /**
   * 返回当前位置
   */
  currPosition(): Position {
    return new Position(this.currLine, this.pos - this.lineStart);
  }

  /**
   * 读取并移到下一个 Token
   */
  next(): void {
    this.skipSpace();
    this.start = this.pos;
    if (this.pos >= this.input.length) {
      if (this.type === tt.end) return;
      return this.finishToken(tt.end);
    } else {
      return this.readToken();
    }
  }

  /**
   * 读取一个 token
   */
  readToken(): void {
    const code = this.input.charCodeAt(this.pos);
    if (isNumericStart(code)) {
      return this.readNumeric();
    }
    return this.readTokenFromCode();
  }

  /**
   * 读取一个数字
   */
  readNumeric(): void {
    const chunkStart = this.pos;
    let allowE = false;
    let allowDot = true;
    let lastCode;
    let lastChar;

    const isSingleChar = (): boolean => {
      return this.pos - chunkStart === 1;
    };

    while (this.pos < this.input.length) {
      const code = this.input.charCodeAt(this.pos);
      const char = this.input[this.pos];

      if (isNumericChar(code)) {
        if (code === 69 || code === 101) { // `E` / `e`
          if (allowE && !(lastCode === 46 && isSingleChar())) { // 单字符 `.` 后不能跟 `E`
            allowE = false;
            allowDot = false;
            const aheadCode = this.input.charCodeAt(this.pos + 1);
            if (aheadCode === 43 || aheadCode === 45) { // `+` / `-`
              this.pos++;
              lastCode = aheadCode;
              lastChar = this.input[this.pos];
            }
          } else {
            this.raise(this.pos, `Unexpected character ${char}`);
          }
        } else if (code === 46) { // .
          if (allowDot) {
            allowDot = false;
          } else {
            this.raise(this.pos, `Unexpected character ${char}`);
          }
        }
        if (!lastChar && !allowE) allowE = true;
        lastCode = code;
        lastChar = char;
        this.pos++;
      } else {
        break;
      }
    }

    if (
      lastCode === 69 // `E`
      || lastCode === 101 // `e`
      || lastCode === 43 // `+`
      || lastCode === 45 // `-`
      || (isSingleChar() && lastCode === 46) // 单字符 `.`
    ) {
      this.raise(this.pos - 1, `Unexpected character \`${lastChar}\``);
    }

    const value = this.input.slice(chunkStart, this.pos);
    return this.finishToken(tt.numeric, value);
  }

  /**
   * 根据字符 code 读取一个 Token，包括自定义注册的运算符
   */
  readTokenFromCode(): void {
    const code = this.input.charCodeAt(this.pos);

    // 优先自定义运算符
    const operator = installedOperators.find(op => {
      return op.code.every((c, i) => {
        return c === this.input.charCodeAt(this.pos + i);
      });
    });
    if (operator) {
      this.pos += operator.code.length;
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
        return this.finishToken(tt.plus, '+');
      case 45: // `-`
        this.pos++;
        return this.finishToken(tt.minus, '-');
      case 47: // `/`
        this.pos++;
        return this.finishToken(tt.div, '/');
      default:
        return this.raise(this.pos - 1, `Unexpected character \`${this.input[this.pos]}\``);
    }
  }

  /**
   * 消费当前指定类型的 token，否则抛出异常
   * @param type
   */
  expect(type: TokenType): void {
    if (!this.eat(type)) {
      this.unexpected();
    }
  }

  /**
   * 消费一个 token，如果是指定的 token 类型，则移动到下一个 token ，返回 true，否则返回 false
   * @param type
   */
  eat(type): boolean {
    if (this.type === type) {
      this.next();
      return true;
    }
    return false;
  }

  finishToken(type: TokenType, value = ''): void {
    this.end = this.pos;
    this.endLoc = this.currPosition();
    this.type = type;
    this.value = value;
  }

  finishNode(node: Node, type: string): Node {
    node.type = type;
    node.end = this.end;
    node.loc.end = this.endLoc;
    return node;
  }

  /**
   * 跳过空白字符
   */
  skipSpace(): void {
    while (this.pos < this.input.length) {
      const code = this.input.charCodeAt(this.pos);
      if (code === 32 || code === 160) { // ` `
        this.pos++;
      } else if (code === 13 || code === 10 || code === 8232 || code === 8233) { // new line
        if (code === 13 && this.input.charCodeAt(this.pos + 1) === 10) { // CRLF
          this.pos++;
        }
        this.pos++;
        this.currLine++;
        this.lineStart = this.pos;
      } else {
        break;
      }
    }
  }

  /**
   * 在当前位置创建一个新节点
   */
  startNode(): Node {
    return new Node(this.start, this.startLoc);
  }

  /**
   * 在指定位置创建一个新节点
   */
  startNodeAt(pos: number, loc: Position): Node {
    return new Node(pos, loc);
  }

  /**
   * 抛出异常
   * @param pos
   * @param message
   */
  raise(pos: number, message: string): void {
    // const loc = getLineInfo(this.input, pos);
    // message += ` (${  loc.line  }:${  loc.column  })`;
    // const err = new SyntaxError(message);
    // err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    // throw err;
    throw new SyntaxError(message);
  }

  /**
   * 抛出 Unexpected token 异常
   * @param pos
   */
  unexpected(pos?: number): void {
    this.raise(pos == null ? this.start : pos, 'Unexpected token');
  }
}

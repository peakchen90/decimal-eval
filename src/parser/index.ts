import {IOperator} from './types';
import {TokenType, tokenContext as tc, tokenTypes as tt, TokenContext} from './tokens';
import {isNumericStart, isNumericChar, Position} from './util';

/**
 * 解析类
 */
export default class Parser {
  input: string
  type: TokenType
  value: string
  context: TokenContext[]
  pos: number
  currLine: number
  lineStart: number
  start: number
  end: number
  startLoc: Position
  endLoc: Position

  static operators: IOperator[] = []

  static use(operator: IOperator): void {
    if (!this.operators.includes(operator)) {
      this.operators.push(operator);
    }
  }

  constructor(input: string) {
    this.input = input;
    this.type = tt.end;
    this.value = '';
    this.context = [tc.parenL];
    this.pos = 0;
    this.currLine = 1;
    this.lineStart = 0;
    this.start = 0;
    this.end = 0;
    this.startLoc = this.currPosition();
    this.endLoc = this.currPosition();
  }

  parse(): void {
    this.next();
    this.parseExpression();
  }

  parseExpression(): void {
  }

  parseRightValue(): void {

  }

  currPosition(): Position {
    return new Position(this.currLine, this.pos - this.lineStart);
  }

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

  readToken(): void {
    const code = this.input.charCodeAt(this.pos);
    if (isNumericStart(code)) {
      return this.readNumeric();
    }
    return this.getTokenFromCode();
  }

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
            this.raise(this.pos, `Unexpected character \`${char}\``);
          }
        } else if (code === 46) { // .
          if (allowDot) {
            allowDot = false;
          } else {
            this.raise(this.pos, `Unexpected character \`${char}\``);
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

    const value = this.input.slice(chunkStart, this.pos++);
    return this.finishToken(tt.numeric, value);
  }

  getTokenFromCode(): void {
    const code = this.input.charCodeAt(this.pos);
    switch (code) {
      case 40: // `(`
        this.pos++;
        return this.finishToken(tt.parenL);
      case 41: // `)`
        this.pos++;
        return this.finishToken(tt.parenR);
      case 42: // `*`
        this.pos++;
        return this.finishToken(tt.times);
      case 43: // `+`
        this.pos++;
        return this.finishToken(tt.plus);
      case 45: // `-`
        this.pos++;
        return this.finishToken(tt.minus);
      case 47: // `/`
        this.pos++;
        return this.finishToken(tt.div);
      default:
        const operator = Parser.operators.find(op => op.code === code);
        if (operator) {
          this.pos++;
          return this.finishToken(operator.tokenType);
        }
    }
    return this.raise(this.pos - 1, `Unexpected character \`${this.input[this.pos]}\``);
  }

  eat(type): boolean {
    if (this.type === type) {
      this.next();
      return true;
    }
    return false;
  }

  finishToken(tokenType: TokenType, value = ''): void {
    const prevType = this.type;
    this.type = tokenType;
    this.value = value;
    this.updateContext(prevType);
    this.context.push(tokenType);
  }

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

  startNode(): void {

  }

  raise(pos: number, message: string): void {
    // const loc = getLineInfo(this.input, pos);
    // message += ` (${  loc.line  }:${  loc.column  })`;
    // const err = new SyntaxError(message);
    // err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    // throw err;
    throw new SyntaxError(message);
  }

  updateContext(prevType?: TokenType): void {
    if (this.type.updateContext) {
      this.type.updateContext(prevType);
    }
  }
}

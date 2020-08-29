/**
 * 位置
 */
export class Position {
  line: string
  column: string

  constructor(line, column) {
    this.line = line;
    this.column = column;
  }
}

/**
 * AST 节点
 */
export class Node {
  type: string
  start: number
  end: number
  loc: {
    start: Position;
    end: Position;
  }

  [key: string]: any

  constructor(start: number, startLoc: Position) {
    this.type = '';
    this.start = start;
    this.end = start;
    this.loc = {
      start: startLoc,
      end: startLoc
    };
  }
}

/**
 * 判断数字开始字符
 * @param code
 */
export function isNumericStart(code: number): boolean {
  if (code === 46) return true; // `.`
  return code >= 48 && code <= 57;// 0-9
}

/**
 * 判断数字可能的字符
 * @param code
 */
export function isNumericChar(code: number): boolean {
  if (isNumericStart(code)) return true;
  if (code === 69) return true; // `E`
  if (code === 101) return true; // `e`
  return false;
}

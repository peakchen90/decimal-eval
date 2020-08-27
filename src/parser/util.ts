export class Position {
  line: string
  column: string

  constructor(line, column) {
    this.line = line;
    this.column = column;
  }
}

export class Node {
  type: string
  start: number
  end: number
  loc: {
    start: number;
    end: number;
  }

  constructor(pos: number, loc: { start: number; end: number }) {
    this.type = '';
    this.start = pos;
    this.end = pos;
    this.loc = loc;
  }
}

export function isNumericStart(code): boolean {
  if (code === 46) return true; // `.`
  return code >= 48 && code <= 57;// 0-9
}

export function isNumericChar(code): boolean {
  if (isNumericStart(code)) return true;
  if (code === 69) return true; // `E`
  if (code === 101) return true; // `e`
  return false;
}

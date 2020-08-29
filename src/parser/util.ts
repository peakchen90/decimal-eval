/**
 * AST 节点
 */
export class Node {
  type: string
  start: number
  end: number

  [key: string]: any

  constructor(start: number) {
    this.type = '';
    this.start = start;
    this.end = start;
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

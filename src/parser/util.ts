export type NodeType = ''
  | 'Expression' | 'BinaryExpression' | 'UnaryExpression'
  | 'NumericLiteral' | 'Identifier'

/**
 * AST 节点
 */
export class Node {
  type: NodeType
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
 * 判断数字可能的字符
 * @param code
 */
export function isNumericChar(code: number): boolean {
  return code >= 48 && code <= 57;
}

/**
 * 判断数字开始字符
 * @param code
 */
export function isNumericStart(code: number): boolean {
  if (code === 46) return true; // `.`
  return isNumericChar(code); // 0-9
}

/**
 * 判断标识符开始字符
 * @param code
 */
export function isIdentifierStart(code: number): boolean {
  if (code >= 65 && code <= 90) return true; // A-Z
  if (code >= 97 && code <= 122) return true; // a-z
  if (code === 36) return true; // `$`
  return false;
}

/**
 * 判断是标识符开始字符
 * @param code
 */
export function isIdentifierChar(code: number): boolean {
  if (isIdentifierStart(code)) return true;
  if (isNumericChar(code)) return true; // 0-9
  if (code === 95) return true; // `_`
  return false;
}

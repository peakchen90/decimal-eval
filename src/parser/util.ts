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

/**
 * 返回一个数字的原始数据
 * @param rawValue
 */
export function getRealNumeric(rawValue: string): string {
  let value = rawValue;

  // 去掉数字分割线线
  const arr: string[] = [];
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code !== 95) { // `_`
      arr.push(value[i]);
    }
  }
  if (arr.length !== value.length) {
    value = arr.join('');
  }

  return value;
}

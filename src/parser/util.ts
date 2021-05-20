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

type Radix = 2 | 8 | 10 | 16;

/**
 * 返回一个数字的进制
 * @param value
 * @param pos
 */
export function getNumericRadix(value: string, pos = 0): Radix {
  const c1 = value.charCodeAt(pos);
  const c2 = value.charCodeAt(pos + 1);
  let radix: Radix = 10;

  if (c1 === 48) { // `0`
    if (c2 === 66 || c2 === 98) { // `B` / `b`
      radix = 2;
    } else if (c2 === 79 || c2 === 111) { // `O` / `o`
      radix = 8;
    } else if (c2 === 88 || c2 === 120) { // `X` / `x`
      radix = 16;
    }
  }
  return radix;
}

/**
 * 返回一个数字的原始数据
 * @param rawValue
 */
export function getNumericRawData(rawValue: string) {
  const radix = getNumericRadix(rawValue);
  let value = rawValue;
  if (radix !== 10) {
    value = rawValue.slice(2);
  }

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

  return {
    radix,
    rawValue,
    value
  };
}

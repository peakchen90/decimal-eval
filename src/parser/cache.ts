import {Node} from './util';

const numericRegexp = /\??(\.[0-9][0-9eE]*|[0-9][.0-9eE]*)/g;

/**
 * 用占位符转换
 * @param expression
 */
export function transformPlaceholder(expression: string): {
  expr: string;
  map: Record<string, string>;
} {
  const map = {};
  let i = 0;
  const expr = String(expression).replace(numericRegexp, (match) => {
    if (match.charCodeAt(0) === 63) { // 表达式存在 `?n`
      throw new Error('The expression cannot contain `?n`, this is reserved');
    }
    return map[`?${++i}`] = match;
  }).replace(/\s/g, '');
  return {map, expr};
}

export interface ICache {
  _cache: Record<string, Node>;

  set(key: string, value: Node): void;

  get(key: string): Node | undefined;

  clear(): void;
}

/**
 * 缓存已解析的表达式 -> AST（开启缓存下）
 */
const cache: ICache = {
  /**
   * 保持缓存数据
   */
  _cache: Object.create(null),

  /**
   * 设置缓存
   * @param key
   * @param value
   */
  set(key: string, value: Node): void {
    this._cache[key] = value;
  },

  /**
   * 返回缓存数据
   * @param key
   */
  get(key: string): Node | undefined {
    return this._cache[key];
  },

  /**
   * 清空缓存
   */
  clear(): void {
    this._cache = Object.create(null);
  }
};

export default cache;

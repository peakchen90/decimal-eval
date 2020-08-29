import {evaluate, Operator, Parser} from '../src';
import {installedOperators} from '../src/operator';

beforeEach(() => {
  // 每次执行前清空注册的运算符
  installedOperators.length = 0;
});

describe('Operator', () => {
  test('custom operator: `%`', () => {
    const mod = Operator.create('%', 14, (a, b) => a % b);
    Parser.use(mod);
    expect(evaluate('1%2')).toBe(1);
  });

  test('custom operator: `%`', () => {
    const mod = Operator.create('%', 14, (a, b) => a % b);
    Parser.use(mod);
    expect(evaluate('1%2')).toBe(1);
  });
});

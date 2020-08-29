import {evaluate, Operator, Parser} from '../src';
import {installedOperators} from '../src/operator';

beforeEach(() => {
  // 每次执行前清空注册的运算符
  installedOperators.length = 0;
});

describe('Operator', () => {
  test('custom operator: `%`', () => {
    const mod = Operator.create('%', 14, (a, b) => a % b);
    Parser.useOperator(mod);
    expect(evaluate('1%2')).toBe(1);
  });

  test('custom operator: `%`', () => {
    const mod = Operator.create('%', 14, (a, b) => a % b);
    Parser.useOperator(mod);
    expect(evaluate('1%2')).toBe(1);
  });

  test('use reserved character as operator', () => {
    const mod = Operator.create('+', 13, (a, b) => a + b);
    expect(() => {
      Parser.useOperator(mod);
    }).toThrowError(/Cannot use reserved character/);
  });

  test('invalid operator', () => {
    expect(() => {
      Operator.create('', 0, (a, b) => a + b);
    }).toThrowError(/The operator should be a non-empty string/);
    expect(() => {
      Operator.create(' * ', 0, (a, b) => a + b);
    }).toThrowError(/The operator should be a non-empty string/);
  });

  test('missing calculation method', () => {
    expect(() => {
      const mod = Operator.create('%', 13, undefined as any);
      Parser.useOperator(mod);
      evaluate('1 % 2');
    }).toThrowError(/Expected to receive a calculation method/);
  });
});

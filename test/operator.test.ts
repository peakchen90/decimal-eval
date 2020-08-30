import {evaluate, Operator, Parser} from '../src';

beforeEach(() => {
  // 每次执行前清空注册的运算符
  Parser.installedOperators.length = 0;
});

describe('Binary Operator', () => {
  test('custom operator: `%`', () => {
    const mod = Operator.create('%', 14, (a, b) => a % b);
    Parser.useOperator(mod);
    expect(evaluate('2 % 3')).toBe(2);
    expect(evaluate('2 % 3 + 5')).toBe(7);
  });

  test('custom operator: `**`', () => {
    const mod = Operator.create('**', 15, (a, b) => Math.pow(a, b));
    Parser.useOperator(mod);
    expect(evaluate('2 ** 3')).toBe(8);
    expect(evaluate('2 ** 3 - 1')).toBe(7);
  });

  test('custom operator: use a identifier', () => {
    const mod = Operator.create('add', 13, (a, b) => a + b);
    Parser.useOperator(mod);
    expect(evaluate('2 add 3')).toBe(5);
  });

  test('cannot use reserved character as operator', () => {
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

describe('Unary Operator', () => {
  // test('custom operator: `%`', () => {
  //   const mod = Operator.create('%', 14, (a, b) => a % b);
  //   Parser.useOperator(mod);
  //   expect(evaluate('2 % 3')).toBe(2);
  //   expect(evaluate('2 % 3 + 5')).toBe(7);
  // });
});

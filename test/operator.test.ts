import {evaluate, Operator, Parser} from '../src/index';

beforeEach(() => {
  // 每次执行前清空注册的运算符
  Parser._installedOperators.length = 0;
});

describe('Binary Operator', () => {
  test('custom binary operator: `%`', () => {
    const mod = Operator.create('%', 14, (a, b) => a % b);
    Parser.useOperator(mod);
    expect(evaluate('2 % 3')).toBe(2);
    expect(evaluate('2 % 3 + 5')).toBe(7);
  });

  test('custom binary operator: `**`', () => {
    const pow = Operator.create('**', 15, (a, b) => Math.pow(a, b));
    Parser.useOperator(pow);
    expect(evaluate('2 ** 3')).toBe(8);
    expect(evaluate('2 ** 3 - 1')).toBe(7);
  });

  test('custom binary operator: use a identifier', () => {
    const add = Operator.create('add', 13, (a, b) => a + b);
    Parser.useOperator(add);
    expect(evaluate('2 add 3')).toBe(5);
  });

  test('cannot use reserved character as operator', () => {
    expect(() => {
      Operator.create('+', 13, (a, b) => a + b);
    }).toThrowError(/The custom operator cannot use reserved character/);
  });

  test('invalid operator', () => {
    expect(() => {
      Operator.create('', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator should be a non-empty string/);
    expect(() => {
      Operator.create(' * ', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator should be a non-empty string/);
    expect(() => {
      Operator.create('.', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator cannot start with a possible number/);
    expect(() => {
      Operator.create('5', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator cannot start with a possible number/);
    expect(() => {
      Operator.create('%', -1, (a, b) => a + b);
    }).toThrowError(/The precedence should be a number greater than 0/);
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
  test('custom unary operator: high precedence `double`', () => {
    const doubleOp = Operator.create('double', 19, (v) => v * 2, true);
    Parser.useOperator(doubleOp);
    expect(evaluate('double1.5')).toBe(3);
    expect(evaluate('double .035 * 100')).toBe(7);
  });

  test('custom unary operator: low precedence `double`', () => {
    const doubleOp = Operator.create('double', 0, (v) => v * 2, true);
    Parser.useOperator(doubleOp);
    expect(evaluate('double 1 + 4 - 2')).toBe(6);
  });

  test('custom unary operator chain', () => {
    const doubleOp = Operator.create('double', 0, (v) => v * 2, true);
    const absOp = Operator.create('abs', 0, (v) => Math.abs(v), true);
    Parser.useOperator(doubleOp);
    Parser.useOperator(absOp);
    expect(evaluate('abs double 2 - 10')).toBe(16);
  });
});

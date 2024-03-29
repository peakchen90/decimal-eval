import {evaluate, Parser} from '../src/index';

beforeEach(() => {
  // 每次执行前清空注册的运算符
  Parser.installedOperators.length = 0;
});

describe('Binary Operator', () => {
  test('custom binary operator: `%`', () => {
    const mod = Parser.createBinaryOperator('%', 14, (a, b) => String(Number(a) % Number(b)));
    Parser.useOperator(mod);
    expect(evaluate('2 % 3')).toBe('2');
    expect(evaluate('2 % 3 + 5')).toBe('7');
  });

  test('custom binary operator: `**`', () => {
    const pow = Parser.createBinaryOperator('**', 15, (a, b) => String(Math.pow(Number(a), Number(b))));
    Parser.useOperator(pow);
    expect(evaluate('2 ** 3')).toBe('8');
    expect(evaluate('2 ** 3 - 1')).toBe('7');
  });

  test('custom binary operator: use a identifier', () => {
    const add = Parser.createBinaryOperator('add', 13, (a, b) => String(Number(a) + Number(b)));
    Parser.useOperator(add);
    expect(evaluate('2 add 3')).toBe('5');
  });

  test('cannot use reserved character as operator', () => {
    expect(() => {
      Parser.createBinaryOperator('+', 13, (a, b) => a + b);
    }).toThrowError(/The custom operator cannot use reserved character/);
  });

  test('invalid operator', () => {
    expect(() => {
      Parser.createBinaryOperator('', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator should be a non-empty string/);
    expect(() => {
      Parser.createBinaryOperator(' * ', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator should be a non-empty string/);
    expect(() => {
      Parser.createBinaryOperator('.', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator cannot start with a possible number/);
    expect(() => {
      Parser.createBinaryOperator('5', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator cannot start with a possible number/);
    expect(() => {
      Parser.createBinaryOperator('?', 0, (a, b) => a + b);
    }).toThrowError(/The custom operator cannot start with `?`/);
    expect(() => {
      Parser.createBinaryOperator('%', -1, (a, b) => a + b);
    }).toThrowError(/The precedence should be a number greater than 0/);
  });

  test('missing calculation method', () => {
    expect(() => {
      const mod = Parser.createBinaryOperator('%', 13, undefined as never);
      Parser.useOperator(mod);
      evaluate('1 % 2');
    }).toThrowError(/Expected to receive a calculation method/);
  });
});

describe('Unary Operator', () => {
  test('custom unary operator: high precedence `double`', () => {
    const doubleOp = Parser.createUnaryOperator('double', 19, (v) => String(Number(v) * 2));
    Parser.useOperator(doubleOp);
    expect(evaluate('double1.5')).toBe('3');
    expect(evaluate('double .035 * 100')).toBe('7');
  });

  test('custom unary operator: low precedence `double`', () => {
    const doubleOp = Parser.createUnaryOperator('double', 0, (v) => String(Number(v) * 2));
    Parser.useOperator(doubleOp);
    expect(evaluate('double 1 + 4 - 2')).toBe('6');
  });

  test('custom unary operator chain', () => {
    const doubleOp = Parser.createUnaryOperator('double', 0, (v) => String(Number(v) * 2));
    const absOp = Parser.createUnaryOperator('abs', 0, (v) => String(Math.abs(Number(v))));
    Parser.useOperator(doubleOp);
    Parser.useOperator(absOp);
    expect(evaluate('abs double 2 - 10')).toBe('16');
  });
});

import {evaluate, Operator, Parser} from '../src/index';
import {IOperator} from '../src/operator';

describe('Evaluate', () => {
  test('empty string', () => {
    expect(evaluate('')).toBe(0);
  });

  test('0.1 + 0.2', () => {
    expect(evaluate('0.1 + 0.2')).toBe(0.3);
  });

  test('0.3 - 0.1', () => {
    expect(evaluate('0.3 - 0.1')).toBe(0.2);
  });

  test('0.6 * 3', () => {
    expect(evaluate('0.6 * 3')).toBe(1.8);
  });

  test('0.3 / 3', () => {
    expect(evaluate('0.3 / 3')).toBe(0.1);
  });

  test('2 * (1.6 - 0.4)', () => {
    expect(evaluate('2 * (1.6 - 0.4)')).toBe(2.4);
  });

  test('-2.e2 * (+1.6 - +0.4)', () => {
    expect(evaluate('-2.e2 * (+1.6 - +0.4)')).toBe(-240);
  });

  // test for super complex calculation
  test('(+.1 + (-.2) - ((1.0e+2 + (-0.5 / (2. * ((100) - 95)))) * 2)) - 4 / 2.', () => {
    expect(evaluate('(+.1 + (-.2) - ((1.0e+2 + (-0.5 / (2. * ((100) - 95)))) * 2)) - 4 / 2.')).toBe(-202);
  });
});


describe('Build-In Custom Operators', () => {
  test('mod', () => {
    Parser.installedOperators.length = 0;
    Parser.useOperator(Operator.mod as IOperator);
    expect(1 % 0.9).toBeLessThan(0.1);
    expect(evaluate('1 % 0.9')).toBe(0.1);
  });

  test('pow', () => {
    Parser.installedOperators.length = 0;
    Parser.useOperator(Operator.pow as IOperator);
    expect(0.2 ** 3).toBeGreaterThan(0.008);
    expect(evaluate('0.2 ** 3')).toBe(0.008);
  });
});

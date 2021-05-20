import {evaluate, Parser} from '../src/index';

describe('Evaluate', () => {
  test('empty string', () => {
    expect(evaluate('')).toBe('0');
  });

  test('0.1 + 0.2', () => {
    expect(evaluate('0.1 + 0.2')).toBe('0.3');
  });

  test('0.3 - 0.1', () => {
    expect(evaluate('0.3 - 0.1')).toBe('0.2');
  });

  test('0.6 * 3', () => {
    expect(evaluate('0.6 * 3')).toBe('1.8');
  });

  test('0.3 / 3', () => {
    expect(evaluate('0.3 / 3')).toBe('0.1');
  });

  test('1 + abc', () => {
    expect(evaluate('1 + abc', {abc: 3})).toBe('4');
  });

  test('2 * (1.6 - 0.4)', () => {
    expect(evaluate('2 * (1.6 - 0.4)')).toBe('2.4');
  });

  test('-2.e2 * (+1.6 - +0.4)', () => {
    expect(evaluate('-2.e2 * (+1.6 - +0.4)')).toBe('-240');
  });

  // test for super complex calculation
  test('(+.1 + (-.2) - ((1.0e+2 + (-0.5 / (2. * ((100) - 95)))) * 2)) - 4 / 2.', () => {
    expect(evaluate('(+.1 + (-.2) - ((1.0e+2 + (-0.5 / (2. * ((100) - 95)))) * 2)) - 4 / 2.')).toBe('-202');
  });
});


describe('Scope Variables', () => {
  test('compile', () => {
    const evaluate = new Parser('0.1 + a').compile();
    expect(evaluate({a: 0.2})).toBe('0.3');
    expect(evaluate({a: -1})).toBe('-0.9');
  });

  test('missing corresponding scope value', () => {
    const evaluate = new Parser('1 + a * c').compile();
    expect(() => {
      evaluate({a: 0.2});
    }).toThrowError('The scope name `c` is not initialized');
  });
});

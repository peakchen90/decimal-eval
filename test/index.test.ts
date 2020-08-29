import {evaluate} from '../src';

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
});

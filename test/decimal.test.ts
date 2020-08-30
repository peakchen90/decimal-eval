import {Decimal} from '../src';

describe('Decimal', () => {
  test('Decimal.evaluate() returns an instance of Decimal', () => {
    expect(Decimal.evaluate('0.1 + 0.2')).toBeInstanceOf(Decimal);
  });

  test('toFixed()', () => {
    expect((1.15).toFixed(1)).toBe('1.1');
    expect(Decimal.evaluate('1.15').toFixed(1)).toBe('1.2');
    expect(Decimal.evaluate('0.1 + 0.2').toFixed(20)).toBe('0.30000000000000000000');
  });

  test('implicit conversion', () => {
    const d = Decimal.evaluate('1.6 + 0.8');
    expect(1.6 + 0.8).toBeGreaterThan(2.4);
    expect(+d).toBe(2.4);
    expect(`$${d}`).toBe('$2.4');
  });
});

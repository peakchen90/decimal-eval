import {evaluate, Parser} from '../src/pure';
import {IAdapter} from '../src/transform';

describe('Pure', () => {
  test('evaluate with default adapter', () => {
    expect(evaluate('0.1 + 0.2')).toBe('0.30000000000000004');
    expect(evaluate('9007199254740992 + 1')).toBe('9007199254740992');
    expect(evaluate('3 - 5')).toBe('-2');
    expect(evaluate('2 * 4')).toBe('8');
    expect(evaluate('20 / 2')).toBe('10');
    expect(evaluate('1 + abc', {abc: 2})).toBe('3');
  });

  test('useAdapter: missing adapter', () => {
    const adapter = {
      '+': (a, b): string => a + b
    };
    expect(() => {
      Parser.useAdapter(adapter as IAdapter);
    }).toThrowError(/Missing method for calculation operator/);
  });

  test('use custom adapter', () => {
    const adapter = {
      '+': (a, b) => String(Number(a) + (2 * b)),
      '-': (a, b) => String(a - (2 * b)),
      '*': (a, b) => String(a * (2 * b)),
      '/': (a, b) => String(a / (2 * b)),
    };
    Parser.useAdapter(adapter);

    expect(evaluate('2 + 5')).toBe('12');
    expect(evaluate('2 - 5')).toBe('-8');
    expect(evaluate('2 * 5')).toBe('20');
    expect(evaluate('2 / 5')).toBe('0.2');
  });
});

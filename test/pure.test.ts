import {evaluate, Parser} from '../src/pure';
import {IAdapter} from '../src/transform';


describe('Pure', () => {
  test('evaluate with no adapter', () => {
    expect(() => {
      evaluate('1 + 2');
    }).toThrowError(/to set the calculation adapter/);
  });

  test('useAdapter: missing adapter', () => {
    const adapter = {
      '+': (a, b): number => a + b
    };
    expect(() => {
      Parser.useAdapter(adapter as IAdapter);
    }).toThrowError(/Missing method for calculation operator/);
  });

  test('use custom adapter', () => {
    const adapter = {
      '+': (a, b): number => a + (2 * b),
      '-': (a, b): number => a - (2 * b),
      '*': (a, b): number => a * (2 * b),
      '/': (a, b): number => a / (2 * b),
    };
    Parser.useAdapter(adapter);

    expect(evaluate('2 + 5')).toBe(12);
    expect(evaluate('2 - 5')).toBe(-8);
    expect(evaluate('2 * 5')).toBe(20);
    expect(evaluate('2 / 5')).toBe(0.2);
  });
});

import {evaluate, Parser} from '../src';
import {transformPlaceholder} from '../src/parser/cache';

beforeEach(() => {
  Parser.config.cache = true;
  Parser._cache.clear();
});

describe('Cache AST Fixtures', () => {
  test('1 + 2', () => {
    const {expr} = transformPlaceholder('1 + 2');
    expect(new Parser(expr).parse()).toMatchObject({
      'type': 'Expression',
      'expression': {
        'type': 'BinaryExpression',
        'left': {
          'type': 'Placeholder',
          'placeholder': '?1'
        },
        'operator': '+',
        'right': {
          'type': 'Placeholder',
          'placeholder': '?2'
        }
      }
    });
  });

  test('+1*(-.2-+3.e+4)', () => {
    const {expr} = transformPlaceholder('+1*(-.2-+3.e+4)');
    expect(new Parser(expr).parse()).toMatchObject({
      'type': 'Expression',
      'expression': {
        'type': 'BinaryExpression',
        'left': {
          'type': 'UnaryExpression',
          'operator': '+',
          'prefix': true,
          'argument': {
            'type': 'Placeholder',
            'placeholder': '?1'
          }
        },
        'operator': '*',
        'right': {
          'type': 'BinaryExpression',
          'left': {
            'type': 'UnaryExpression',
            'operator': '-',
            'prefix': true,
            'argument': {
              'type': 'Placeholder',
              'placeholder': '?2'
            }
          },
          'operator': '-',
          'right': {
            'type': 'UnaryExpression',
            'operator': '+',
            'prefix': true,
            'argument': {
              'type': 'Placeholder',
              'placeholder': '?3'
            }
          },
        }
      }
    });
  });
});

describe('Cache Evaluate', () => {
  test('0.1 + 0.2', () => {
    expect(evaluate('0.1 + 0.2')).toBe(0.3);
    expect(Parser._cache.get('?1+?2')).toMatchObject({
      'type': 'Expression',
      'expression': {
        'type': 'BinaryExpression',
        'left': {
          'type': 'Placeholder',
          'placeholder': '?1'
        },
        'operator': '+',
        'right': {
          'type': 'Placeholder',
          'placeholder': '?2'
        }
      }
    });
    expect(evaluate('1.e-3+2e2')).toBe(200.001);
    expect(Object.keys(Parser._cache._cache).length).toBe(1);
  });
});

describe('Cache Error Capture', () => {
  test('expression contain `?n`', () => {
    expect(() => {
      evaluate('0.1 + ?1');
    }).toThrowError('The expression cannot contain `?n`, this is reserved');
  });

  test('disable cache', () => {
    Parser.config.cache = false;
    expect(() => {
      evaluate('0.1 + ?1');
    }).toThrowError('Unexpected token ? at position 6');
  });
});


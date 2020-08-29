import Parser from '../src/parser';
import fixtures from './fixtures';

describe('Parser Fixtures', () => {
  Object.keys(fixtures).forEach(expr => {
    test(`Test expression: \`${expr}\``, () => {
      const ast = new Parser(expr).parse();
      expect(ast).toEqual(fixtures[expr]);
    });
  });
});

describe('Parser Special Case', () => {
  test('empty string', () => {
    expect(new Parser('').parse()).toBe(null);
  });

  test('skip space', () => {
    expect(new Parser('\r\n 1 \t \v + \t 2 \n').parse()).toMatchObject({
      'type': 'Expression',
      'expression': {
        'type': 'BinaryExpression',
        'left': {
          'type': 'NumericLiteral',
          'value': '1'
        },
        'operator': '+',
        'right': {
          'type': 'NumericLiteral',
          'value': '2'
        }
      }
    });
  });
});

describe('Parser Error Capture', () => {
  test('unexpected token in the end', () => {
    expect(() => {
      new Parser('1+').parse();
    }).toThrowError(/Unexpected end of input/);
  });

  test('unexpected token when read numeric with prefix', () => {
    expect(() => {
      new Parser('1++)').parse();
    }).toThrowError(/Unexpected token/);
  });

  test('unexpected token: `e`', () => {
    expect(() => {
      new Parser('1e2e3').parse();
    }).toThrowError(/Unexpected token/);
    expect(() => {
      new Parser('1e').parse();
    }).toThrowError(/Unexpected token/);
    expect(() => {
      new Parser('.E').parse();
    }).toThrowError(/Unexpected token/);
  });

  test('unexpected token: `.`', () => {
    expect(() => {
      new Parser('1.2.3').parse();
    }).toThrowError(/Unexpected token/);
    expect(() => {
      new Parser('.').parse();
    }).toThrowError(/Unexpected token/);
  });

  test('unexpected token: extra `)`', () => {
    expect(() => {
      new Parser('1+(2+3))').parse();
    }).toThrowError(/Unexpected token/);
  });

  test('unexpected token: missing `)`', () => {
    expect(() => {
      new Parser('(2+3 3').parse();
    }).toThrowError(/Unexpected token/);
  });

  test('unexpected token: unknown character', () => {
    expect(() => {
      new Parser('1^2').parse();
    }).toThrowError(/Unexpected token/);
  });
});

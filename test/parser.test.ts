import Parser from '../src/parser';
import fixtures from './fixtures';

describe('AST parser fixtures', () => {
  Object.keys(fixtures).forEach(expr => {
    test(`Test expression: \`${expr}\``, () => {
      const ast = new Parser(expr).parse();
      expect(ast).toEqual(fixtures[expr]);
    });
  });
});

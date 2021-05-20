import {Parser} from '../src/index';
import tokenFixtures from './token.fixtures';

describe('Token', () => {
  describe('Token Fixtures', () => {
    Object.keys(tokenFixtures).forEach(expr => {
      test(`Test token: \`${expr}\``, () => {
        const {readIndex = 1, error, tokenType} = tokenFixtures[expr];
        const parser = new Parser(expr);
        const cb = () => {
          for (let i = 0; i < readIndex; i++) {
            parser.next();
          }
        };

        if (error) {
          expect(cb).toThrowError(error);
        } else {
          cb();
          expect(parser.tokenType).toBe(tokenType);
        }
      });
    });
  });

});

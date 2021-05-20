import {TokenType, tokenTypes} from '../src/parser/token-type';

interface ITokenFixtures {
  [key: string]: {
    tokenType?: TokenType
    error?: string
    readIndex?: number
  };
}

const tokenFixtures: ITokenFixtures = {
  // number
  '1': {
    tokenType: tokenTypes.numeric,
  },
  '1.': {
    tokenType: tokenTypes.numeric
  },
  '.1': {
    tokenType: tokenTypes.numeric
  },
  '1.0': {
    tokenType: tokenTypes.numeric
  },
  '1e2': {
    tokenType: tokenTypes.numeric
  },
  '1E2': {
    tokenType: tokenTypes.numeric
  },
  '1.e2': {
    tokenType: tokenTypes.numeric
  },
  '1.0e2': {
    tokenType: tokenTypes.numeric
  },
  '1.0e+2': {
    tokenType: tokenTypes.numeric
  },
  '1.0e-2': {
    tokenType: tokenTypes.numeric
  },
  '1_2.3_4e+1_2': {
    tokenType: tokenTypes.numeric
  },
  '.': {
    error: 'Unexpected token . at position 0'
  },
  '1e': {
    error: 'Unexpected token e at position 1'
  },
  '.e2': {
    error: 'Unexpected token e at position 1'
  },
  '1e+-2': {
    error: 'Unexpected token - at position 3'
  },
  '1_2_': {
    error: 'Unexpected token _ at position 3'
  },
  '1__2': {
    error: 'Unexpected token _ at position 2'
  },
  // special number
  // '0b1100': {
  //   tokenType: tokenTypes.numeric
  // },
  // '0B1100': {
  //   tokenType: tokenTypes.numeric
  // },
  // '0o7654': {
  //   tokenType: tokenTypes.numeric
  // },
  // '0O7654': {
  //   tokenType: tokenTypes.numeric
  // },
  // '0xFa12': {
  //   tokenType: tokenTypes.numeric
  // },
  // '0Xfa12': {
  //   tokenType: tokenTypes.numeric
  // },
  // '0xf_a_3': {
  //   tokenType: tokenTypes.numeric
  // },
  // '0b2': {
  //   error: 'TODO'
  // },
  // '0o8': {
  //  error: 'TODO'
  // },
  // '0xg': {
  //  error: 'TODO'
  // },

  // identifier
  'A': {
    tokenType: tokenTypes.identifier
  },
  'a': {
    tokenType: tokenTypes.identifier
  },
  '$': {
    tokenType: tokenTypes.identifier
  },
  'a$1_B': {
    tokenType: tokenTypes.identifier
  },

  // char
  '': {
    tokenType: tokenTypes.end
  },
  '(': {
    tokenType: tokenTypes.parenL
  },
  ')': {
    tokenType: tokenTypes.parenR
  },
  '1+': {
    tokenType: tokenTypes.plus,
    readIndex: 2
  },
  '1-': {
    tokenType: tokenTypes.minus,
    readIndex: 2
  },
  '1*': {
    tokenType: tokenTypes.times,
    readIndex: 2
  },
  '1/': {
    tokenType: tokenTypes.div,
    readIndex: 2
  },
  '+1': {
    tokenType: tokenTypes.prefixPlus,
    readIndex: 1
  },
  '-1': {
    tokenType: tokenTypes.prefixMinus,
    readIndex: 1
  },
};

export default tokenFixtures;

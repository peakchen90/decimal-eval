import {Node} from '../src/parser/util';

interface IParserFixtures {
  [key: string]: Node;
}

/**
 * AST node fixtures
 */
const parserFixtures: IParserFixtures = {
  '1': {
    'type': 'Expression',
    'start': 0,
    'end': 1,
    'expression': {
      'type': 'NumericLiteral',
      'start': 0,
      'end': 1,
      'value': '1'
    }
  },
  '1.e3': {
    'type': 'Expression',
    'start': 0,
    'end': 4,
    'expression': {
      'type': 'NumericLiteral',
      'start': 0,
      'end': 4,
      'value': '1.e3'
    }
  },
  '1.2e+3': {
    'type': 'Expression',
    'start': 0,
    'end': 6,
    'expression': {
      'type': 'NumericLiteral',
      'start': 0,
      'end': 6,
      'value': '1.2e+3'
    }
  },
  '1.2E-3': {
    'type': 'Expression',
    'start': 0,
    'end': 6,
    'expression': {
      'type': 'NumericLiteral',
      'start': 0,
      'end': 6,
      'value': '1.2E-3'
    }
  },
  '1+2': {
    'type': 'Expression',
    'start': 0,
    'end': 3,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 3,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '+',
      'right': {
        'type': 'NumericLiteral',
        'start': 2,
        'end': 3,
        'value': '2'
      }
    }
  },
  '1-2': {
    'type': 'Expression',
    'start': 0,
    'end': 3,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 3,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '-',
      'right': {
        'type': 'NumericLiteral',
        'start': 2,
        'end': 3,
        'value': '2'
      }
    }
  },
  '1*2': {
    'type': 'Expression',
    'start': 0,
    'end': 3,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 3,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '*',
      'right': {
        'type': 'NumericLiteral',
        'start': 2,
        'end': 3,
        'value': '2'
      }
    }
  },
  '1/2': {
    'type': 'Expression',
    'start': 0,
    'end': 3,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 3,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '/',
      'right': {
        'type': 'NumericLiteral',
        'start': 2,
        'end': 3,
        'value': '2'
      }
    }
  },
  '1-+2': {
    'type': 'Expression',
    'start': 0,
    'end': 4,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 4,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '-',
      'right': {
        'type': 'UnaryExpression',
        'start': 2,
        'end': 4,
        'operator': '+',
        'prefix': true,
        'argument': {
          'type': 'NumericLiteral',
          'start': 3,
          'end': 4,
          'value': '2',
        }
      }
    }
  },
  '1+-2': {
    'type': 'Expression',
    'start': 0,
    'end': 4,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 4,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '+',
      'right': {
        'type': 'UnaryExpression',
        'start': 2,
        'end': 4,
        'operator': '-',
        'prefix': true,
        'argument': {
          'type': 'NumericLiteral',
          'start': 3,
          'end': 4,
          'value': '2',
        }
      }
    }
  },
  '1++2': {
    'type': 'Expression',
    'start': 0,
    'end': 4,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 4,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '+',
      'right': {
        'type': 'UnaryExpression',
        'start': 2,
        'end': 4,
        'operator': '+',
        'prefix': true,
        'argument': {
          'type': 'NumericLiteral',
          'start': 3,
          'end': 4,
          'value': '2',
        }
      }
    }
  },
  '1--2': {
    'type': 'Expression',
    'start': 0,
    'end': 4,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 4,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '-',
      'right': {
        'type': 'UnaryExpression',
        'start': 2,
        'end': 4,
        'operator': '-',
        'prefix': true,
        'argument': {
          'type': 'NumericLiteral',
          'start': 3,
          'end': 4,
          'value': '2',
        }
      }
    }
  },
  '1 - + - ( + 2 - - 3 )': {
    'type': 'Expression',
    'start': 0,
    'end': 21,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 21,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '-',
      'right': {
        'type': 'UnaryExpression',
        'start': 4,
        'end': 21,
        'operator': '+',
        'prefix': true,
        'argument': {
          'type': 'UnaryExpression',
          'start': 6,
          'end': 21,
          'operator': '-',
          'prefix': true,
          'argument': {
            'type': 'BinaryExpression',
            'start': 10,
            'end': 19,
            'left': {
              'type': 'UnaryExpression',
              'start': 10,
              'end': 13,
              'operator': '+',
              'prefix': true,
              'argument': {
                'type': 'NumericLiteral',
                'start': 12,
                'end': 13,
                'value': '2'
              }
            },
            'operator': '-',
            'right': {
              'type': 'UnaryExpression',
              'start': 16,
              'end': 19,
              'operator': '-',
              'prefix': true,
              'argument': {
                'type': 'NumericLiteral',
                'start': 18,
                'end': 19,
                'value': '3'
              }
            }
          }
        }
      }
    }
  },
  ' 1 + 2 - 3 * 4 / 5 ': {
    'type': 'Expression',
    'start': 1,
    'end': 18,
    'expression': {
      'type': 'BinaryExpression',
      'start': 1,
      'end': 18,
      'left': {
        'type': 'BinaryExpression',
        'start': 1,
        'end': 6,
        'left': {
          'type': 'NumericLiteral',
          'start': 1,
          'end': 2,
          'value': '1'
        },
        'operator': '+',
        'right': {
          'type': 'NumericLiteral',
          'start': 5,
          'end': 6,
          'value': '2'
        }
      },
      'operator': '-',
      'right': {
        'type': 'BinaryExpression',
        'start': 9,
        'end': 18,
        'left': {
          'type': 'BinaryExpression',
          'start': 9,
          'end': 14,
          'left': {
            'type': 'NumericLiteral',
            'start': 9,
            'end': 10,
            'value': '3'
          },
          'operator': '*',
          'right': {
            'type': 'NumericLiteral',
            'start': 13,
            'end': 14,
            'value': '4'
          }
        },
        'operator': '/',
        'right': {
          'type': 'NumericLiteral',
          'start': 17,
          'end': 18,
          'value': '5'
        }
      }
    }
  },
  ' ( 1 + 2 ) ': {
    'type': 'Expression',
    'start': 1,
    'end': 10,
    'expression': {
      'type': 'BinaryExpression',
      'start': 3,
      'end': 8,
      'left': {
        'type': 'NumericLiteral',
        'start': 3,
        'end': 4,
        'value': '1'
      },
      'operator': '+',
      'right': {
        'type': 'NumericLiteral',
        'start': 7,
        'end': 8,
        'value': '2'
      }
    }
  },
  '1 + 2 - 3': {
    'type': 'Expression',
    'start': 0,
    'end': 9,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 9,
      'left': {
        'type': 'BinaryExpression',
        'start': 0,
        'end': 5,
        'left': {
          'type': 'NumericLiteral',
          'start': 0,
          'end': 1,
          'value': '1'
        },
        'operator': '+',
        'right': {
          'type': 'NumericLiteral',
          'start': 4,
          'end': 5,
          'value': '2'
        }
      },
      'operator': '-',
      'right': {
        'type': 'NumericLiteral',
        'start': 8,
        'end': 9,
        'value': '3'
      }
    }
  },
  '1 + 2 * 3': {
    'type': 'Expression',
    'start': 0,
    'end': 9,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 9,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '+',
      'right': {
        'type': 'BinaryExpression',
        'start': 4,
        'end': 9,
        'left': {
          'type': 'NumericLiteral',
          'start': 4,
          'end': 5,
          'value': '2'
        },
        'operator': '*',
        'right': {
          'type': 'NumericLiteral',
          'start': 8,
          'end': 9,
          'value': '3'
        }
      }
    }
  },
  '1 / 2 - 3': {
    'type': 'Expression',
    'start': 0,
    'end': 9,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 9,
      'left': {
        'type': 'BinaryExpression',
        'start': 0,
        'end': 5,
        'left': {
          'type': 'NumericLiteral',
          'start': 0,
          'end': 1,
          'value': '1'
        },
        'operator': '/',
        'right': {
          'type': 'NumericLiteral',
          'start': 4,
          'end': 5,
          'value': '2'
        }
      },
      'operator': '-',
      'right': {
        'type': 'NumericLiteral',
        'start': 8,
        'end': 9,
        'value': '3'
      }
    }
  },
  '1 * (2 - 3)': {
    'type': 'Expression',
    'start': 0,
    'end': 11,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 11,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 1,
        'value': '1'
      },
      'operator': '*',
      'right': {
        'type': 'BinaryExpression',
        'start': 5,
        'end': 10,
        'left': {
          'type': 'NumericLiteral',
          'start': 5,
          'end': 6,
          'value': '2'
        },
        'operator': '-',
        'right': {
          'type': 'NumericLiteral',
          'start': 9,
          'end': 10,
          'value': '3'
        }
      }
    }
  },
  '(1 + 2) * 3': {
    'type': 'Expression',
    'start': 0,
    'end': 11,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 11,
      'left': {
        'type': 'BinaryExpression',
        'start': 1,
        'end': 6,
        'left': {
          'type': 'NumericLiteral',
          'start': 1,
          'end': 2,
          'value': '1'
        },
        'operator': '+',
        'right': {
          'type': 'NumericLiteral',
          'start': 5,
          'end': 6,
          'value': '2'
        },
      },
      'operator': '*',
      'right': {
        'type': 'NumericLiteral',
        'start': 10,
        'end': 11,
        'value': '3'
      }
    }
  },
  '(( 1 + 2) / 3) * (4 - 5 * (6))': {
    'type': 'Expression',
    'start': 0,
    'end': 30,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 30,
      'left': {
        'type': 'BinaryExpression',
        'start': 1,
        'end': 13,
        'left': {
          'type': 'BinaryExpression',
          'start': 3,
          'end': 8,
          'left': {
            'type': 'NumericLiteral',
            'start': 3,
            'end': 4,
            'value': '1'
          },
          'operator': '+',
          'right': {
            'type': 'NumericLiteral',
            'start': 7,
            'end': 8,
            'value': '2'
          },
        },
        'operator': '/',
        'right': {
          'type': 'NumericLiteral',
          'start': 12,
          'end': 13,
          'value': '3'
        },
      },
      'operator': '*',
      'right': {
        'type': 'BinaryExpression',
        'start': 18,
        'end': 29,
        'left': {
          'type': 'NumericLiteral',
          'start': 18,
          'end': 19,
          'value': '4'
        },
        'operator': '-',
        'right': {
          'type': 'BinaryExpression',
          'start': 22,
          'end': 29,
          'left': {
            'type': 'NumericLiteral',
            'start': 22,
            'end': 23,
            'value': '5'
          },
          'operator': '*',
          'right': {
            'type': 'NumericLiteral',
            'start': 27,
            'end': 28,
            'value': '6'
          }
        },
      }
    }
  },
  'a + b': {
    'type': 'Expression',
    'start': 0,
    'end': 5,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 5,
      'left': {
        'type': 'Identifier',
        'start': 0,
        'end': 1,
        'name': 'a'
      },
      'operator': '+',
      'right': {
        'type': 'Identifier',
        'start': 4,
        'end': 5,
        'name': 'b'
      }
    }
  },
  '1.2+($1-A_bc123)': {
    'type': 'Expression',
    'start': 0,
    'end': 16,
    'expression': {
      'type': 'BinaryExpression',
      'start': 0,
      'end': 16,
      'left': {
        'type': 'NumericLiteral',
        'start': 0,
        'end': 3,
        'value': '1.2'
      },
      'operator': '+',
      'right': {
        'type': 'BinaryExpression',
        'start': 5,
        'end': 15,
        'left': {
          'type': 'Identifier',
          'start': 5,
          'end': 7,
          'name': '$1'
        },
        'operator': '-',
        'right': {
          'type': 'Identifier',
          'start': 8,
          'end': 15,
          'name': 'A_bc123'
        },
      }
    }
  }
};

export default parserFixtures;

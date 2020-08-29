import {Node} from '../src/parser/util';

interface IFixtures {
  [key: string]: Node;
}

/**
 * AST node fixtures
 */
const fixtures: IFixtures = {
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
  '1.2e-3': {
    'type': 'Expression',
    'start': 0,
    'end': 6,
    'expression': {
      'type': 'NumericLiteral',
      'start': 0,
      'end': 6,
      'value': '1.2e-3'
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
        'type': 'NumericLiteral',
        'start': 2,
        'end': 4,
        'value': '+2'
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
        'type': 'NumericLiteral',
        'start': 2,
        'end': 4,
        'value': '-2'
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
        'type': 'NumericLiteral',
        'start': 2,
        'end': 4,
        'value': '+2'
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
        'type': 'NumericLiteral',
        'start': 2,
        'end': 4,
        'value': '-2'
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
  }
};

export default fixtures;

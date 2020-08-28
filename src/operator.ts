import {TokenType} from './parser/tokens';
import {IOperator} from './parser/types';

export default class Operator {
  static create(
    value: string,
    precedence: number,
    calc: (left: number, right: number) => number
  ): IOperator {
    return {
      type: new TokenType(value, {
        isOperator: true,
        precedence
      }),
      value,
      code: value.charCodeAt(0),
      calc
    };
  }

  static mod = Operator.create('%', 12, (left, right) => left % right);
}


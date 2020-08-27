import {TokenType} from './parser/tokens';
import {IOperator} from './parser/types';

export default class Operator {
  static create(
    value: string,
    priority: number,
    calc: (left: number, right: number) => number
  ): IOperator {
    return {
      tokenType: new TokenType(value, {
        isOperator: true,
        priority
      }),
      value,
      code: value.charCodeAt(0),
      calc
    };
  }

  static mod = Operator.create('%', 12, (left, right) => left % right);
}


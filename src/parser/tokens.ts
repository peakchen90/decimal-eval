import {UpdateContext} from './types';
import Parser from './index';

export interface ITokenTypeOptions {
  isOperator?: boolean;
  precedence?: number;
}

export class TokenType {
  label: string
  isOperator: boolean
  precedence: number
  updateContext?: UpdateContext

  constructor(label: string, options: ITokenTypeOptions = {}) {
    this.label = label;
    this.isOperator = !!options.isOperator;
    this.precedence = options.precedence != null ? options.precedence : -1;
  }
}

export class TokenContext {
  label: string

  constructor(label: string,) {
    this.label = label;
  }
}

export const tokenTypes = {
  parenL: new TokenType('('),
  parenR: new TokenType(')'),
  end: new TokenType('end'),
  numeric: new TokenType('numeric'),
  plus: new TokenType('+', {isOperator: true, precedence: 10}),
  minus: new TokenType('-', {isOperator: true, precedence: 10}),
  times: new TokenType('*', {isOperator: true, precedence: 20}),
  div: new TokenType('/', {isOperator: true, precedence: 20})
};

export const tokenContext = {
  parenL: new TokenContext('('),
  parenR: new TokenContext(')'),
};

tokenTypes.parenL.updateContext = function (this: Parser): void {
  this.context.push(tokenContext.parenL);
};

tokenTypes.parenR.updateContext = function (this: Parser): void {
  this.context.pop();
};


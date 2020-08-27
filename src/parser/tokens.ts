import {UpdateContext} from './types';
import Parser from './index';

export interface ITokenTypeOptions {
  isOperator?: boolean;
  priority?: number;
}

export class TokenType {
  label: string
  isOperator: boolean
  priority: number
  updateContext?: UpdateContext

  constructor(label: string, options: ITokenTypeOptions = {}) {
    this.label = label;
    this.isOperator = !!options.isOperator;
    this.priority = options.priority != null ? options.priority : -1;
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
  plus: new TokenType('+', {isOperator: true, priority: 10}),
  minus: new TokenType('-', {isOperator: true, priority: 10}),
  times: new TokenType('*', {isOperator: true, priority: 20}),
  div: new TokenType('/', {isOperator: true, priority: 20})
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


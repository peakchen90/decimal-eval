import {TokenType} from './tokens';

export type UpdateContext = (prevType) => void;

export interface IOperator {
  value: string;
  code: number;
  type: TokenType;
  calc: (left: number, right: number) => number;
}

import Big from 'big.js';
import DecimalEval, {Parser} from './pure';
import {IAdapter} from './transform';
import Decimal from './decimal';

/**
 * 默认计算适配器
 */
const defaultAdapter: IAdapter = {
  '+': (left, right) => {
    return Number(new Big(left).plus(right));
  },
  '-': (left, right) => {
    return Number(new Big(left).minus(right));
  },
  '*': (left, right) => {
    return Number(new Big(left).times(right));
  },
  '/': (left, right) => {
    return Number(new Big(left).div(right));
  }
};

Parser.useAdapter(defaultAdapter);

export default DecimalEval;
export * from './pure';
export {
  Decimal,
  Big
};

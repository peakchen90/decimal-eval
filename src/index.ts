import Big from 'big.js';
import DecimalEval, {Operator, Parser} from './pure';
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

// build-in custom operators
Operator.mod = Operator.create('%', 14, (left, right) => {
  return Number(new Big(left).mod(right));
});
Operator.pow = Operator.create('**', 15, (left, right) => {
  return Number(new Big(left).pow(right));
});
Operator.abs = Operator.create('abs', 16, (value) => {
  return Number(new Big(value).abs());
}, true);

export default DecimalEval;
export * from './pure';
export {
  Decimal,
  Big
};

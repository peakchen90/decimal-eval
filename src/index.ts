import BigNumber from 'bignumber.js';
import DecimalEval, {Parser} from './pure';
import {IAdapter} from './transform';

/**
 * big.js 计算适配器
 */
const bigJSAdapter: Readonly<IAdapter> = {
  '+': (left, right) => {
    return new BigNumber(left).plus(right).toString();
  },
  '-': (left, right) => {
    return new BigNumber(left).minus(right).toString();
  },
  '*': (left, right) => {
    return new BigNumber(left).times(right).toString();
  },
  '/': (left, right) => {
    return new BigNumber(left).div(right).toString();
  }
};

Parser.useAdapter(bigJSAdapter);


export default DecimalEval;
export * from './pure';
export {
  BigNumber
};

import Big from 'big.js';
import DecimalEval, {Parser} from './pure';
import {IAdapter} from './transform';

/**
 * big.js 计算适配器
 */
const bigJSAdapter: Readonly<IAdapter> = {
  '+': (left, right) => {
    return new Big(left).plus(right).toString();
  },
  '-': (left, right) => {
    return new Big(left).minus(right).toString();
  },
  '*': (left, right) => {
    return new Big(left).times(right).toString();
  },
  '/': (left, right) => {
    return new Big(left).div(right).toString();
  }
};

Parser.useAdapter(bigJSAdapter);
Parser.useGetRadixNumber((value, radix) => {
  let res = new Big(0);
  for (let i = value.length - 1; i >= 0; i--) {
    res = res.add(
      new Big(radix).pow(value.length - i - 1).times(value[i])
    );
  }
  return res.toString();
});

export default DecimalEval;
export * from './pure';
export {
  Big
};

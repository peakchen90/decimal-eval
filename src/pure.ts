import Parser from './parser';
import Operator, {createBinaryOperator, createUnaryOperator, useOperator} from './operator';
import {useAdapter, useGetRadixNumber} from './transform';

declare const __VERSION__: string;

const evaluate = Parser.evaluate;

Parser.createBinaryOperator = createBinaryOperator;
Parser.createUnaryOperator = createUnaryOperator;
Parser.useOperator = useOperator;
Parser.useAdapter = useAdapter;
Parser.useGetRadixNumber = useGetRadixNumber;


const DecimalEval = {
  evaluate,
  Parser,
  Operator,
  version: __VERSION__
};

export {
  evaluate,
  Parser,
  Operator
};
export default DecimalEval;

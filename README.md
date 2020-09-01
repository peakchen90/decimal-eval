# decimal-eval
A small, safe, fast JavaScript library for parsing decimal arithmetic.

[![Travis (.org) branch](https://img.shields.io/travis/peakchen90/decimal-eval/master.svg)](https://travis-ci.org/peakchen90/decimal-eval)
[![Codecov](https://img.shields.io/codecov/c/github/peakchen90/decimal-eval.svg)](https://codecov.io/gh/peakchen90/decimal-eval)
[![npm](https://img.shields.io/npm/v/decimal-eval.svg)](https://www.npmjs.com/package/decimal-eval)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peakchen90/decimal-eval/blob/master/LICENSE)

## Get Started

### Installation
```
# use npm
npm i -S decimal-eval

# or use yarn
yarn add decimal-eval
```

### Usage
Support the four arithmetic operations of addition, subtraction, multiplication and division,
and automatically fix JS decimal precision by [big.js](https://github.com/MikeMcl/big.js).

```js
import {evaluate} from 'decimal-eval';

evaluate('0.1 + 0.2') // 0.3
evaluate('100 * (0.08 - 0.01)'); // 7
evaluate('1 + abc', { abc: 2 }); // 3
```

In addition to the above operators, it also supports custom operator expansion,
and supports unary operators and binary operators.
The operator precedence according to: [MDN operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).

```js
import {evaluate, Parser, Operator} from 'decimal-eval';

// create binary operator `add`, the precedence is 13
const addOp = Operator.create('add', 13, (left, right) => {
  return left + right;
});

// create unary operator `sin`, the precedence is 16
const sinOp = Operator.create('sin', 16, (value) => {
  return Math.sin(value);
}, true);

// install custom operators
Parser.useOperator(addOp);
Parser.useOperator(sinOp);

// same as: `1 + Math.sin(-2)`
evaluate('1 add sin -2') // 0.09070257317431829
```

## API
### `evaluate(expression: string, scope?: Record<string, number>): number`
Parse and calculate arithmetic expression.
```js
import {evaluate} from 'decimal-eval';

evaluate('1 + 2'); // 3
evaluate('1 + abc', { abc: 2 }); // 3
```

### Operator
#### `Operator.create(value: string, precedence: number, calc: Function, isPrefix = false)`
```js
import {Operator} from 'decimal-eval';
// create operator `%`, which is a binary operator, the calc should like: `(left: number, right: number) => number`
const modOp = Operator.create('%', 15, (left, right) => left % right);

// `isPrefix` is true, that is a unary operator, the calc should like: `(value: number) => number`
const absOp = Operator.create('abs', 16, (value) => Math.abs(value), true);
```

### Parser

#### `new Parser(expression: string).parse(): AST`
Parse arithmetic expressions.
```js
import {Parser} from 'decimal-eval';

const ast = new Parser('1 + 2').parse();
```

#### `new Parser(expression: string).compile(): (scope) => number`
Compile and cache expression.
```js
import {Parser} from 'decimal-eval';

const evaluate = new Parser('1 + abc').compile();
evaluate({ abc: 2 }); // 3
evaluate({ abc: 9 }); // 10
evaluate({ def: 1 }); // throw error
```

#### `Parser.useOperator(operator)`
Install an operator, which created by the `Operator.create()` method.

#### `Parser.useAdapter(adapter)`
Custom setting calculation adapter method to four arithmetic (`+`, `-`, `*`, `/`).
[Big.js](https://github.com/MikeMcl/big.js) is used by default.
```js
Parser.useAdapter({
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right
})
```

#### `Parser.evaluate(expression: string): number`
Alias of `evaluate(expression: string)` method.

## Advanced

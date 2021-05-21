# decimal-eval
A tiny, safe, fast JavaScript library for decimal arithmetic expressions.

[![Build Status](https://www.travis-ci.com/peakchen90/decimal-eval.svg?branch=master)](https://www.travis-ci.com/peakchen90/decimal-eval)
[![Codecov](https://img.shields.io/codecov/c/github/peakchen90/decimal-eval.svg)](https://codecov.io/gh/peakchen90/decimal-eval)
[![npm](https://img.shields.io/npm/v/decimal-eval.svg)](https://www.npmjs.com/package/decimal-eval)
[![BUNDLE SIZE](https://badgen.net/bundlephobia/minzip/decimal-eval)](https://bundlephobia.com/result?p=decimal-eval)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peakchen90/decimal-eval/blob/master/LICENSE)

English | [简体中文](./README.ZH-CN.md)

## Features
- :v: Automatically deal with the JavaScript decimal precision problem by [bignumber.js](https://github.com/MikeMcl/bignumber.js), and supports big number
- :rocket: Fast and tiny, only 28.7 KB minified and 11.2 KB gzipped (pure only 10.5 KB minified and 3.3 KB gzipped without `bignumber.js`)
- :writing_hand: Easy to extend custom operator
- :vulcan_salute: Supports expression scope variables

## Get Started

### Installation
```
# use npm
npm i -S decimal-eval

# or use yarn
yarn add decimal-eval
```


### Usage
Supports the four arithmetic operations (`+`, `-`, `*`, `/`),
and automatically deal with JavaScript decimal precision by [bignumber.js](https://github.com/MikeMcl/bignumber.js), and supports big number.

```js
import {evaluate} from 'decimal-eval';

evaluate('0.1 + 0.2') // '0.3'
evaluate('100 * (0.08 - 0.01)'); // '7'
evaluate('9007199254740992 + 1'); // '9007199254740993'
evaluate('1 + abc', { abc: 2 }); // '3'
```

In addition to the above operators, it also supports custom operator expansion,
and supports unary operators and binary operators.
The operator precedence according to: [MDN operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).

```js
import {evaluate, Parser} from 'decimal-eval';

// create binary operator `add`, the precedence is 13
const addOp = Parser.createBinaryOperator('add', 13, (left, right) => {
  return String(Number(left) + Number(left));
});

// create unary operator `sin`, the precedence is 16
const sinOp = Parser.createUnaryOperator('sin', 16, (value) => {
  return String(Math.sin(value));
});

// install custom operators
Parser.useOperator(addOp);
Parser.useOperator(sinOp);

// same as: `1 + Math.sin(-2)`
evaluate('1 add sin -2') // '0.09070257317431829'
```


## API
### evaluate(expression: string, scope?: Record<string, number>): number
Parse the arithmetic expression and then calculate the result. The name of scope has the following restrictions:
- muse be start with `a-z` or `A-Z`
- only includes `a-z`、`A-Z`、`0-9` and `_`

```js
import {evaluate} from 'decimal-eval';

evaluate('1 + 2'); // '3'
evaluate('1 + abc', { abc: 2 }); // '3'
```

### Parser

#### new Parser(expression: string).parse(): Node | null
Parse arithmetic expressions.

```js
import {Parser} from 'decimal-eval';

const node = new Parser('1 + 2').parse();
```

#### new Parser(expression: string).compile(): (scope: Record<string, number | string>) => string
Compile and cache the arithmetic expression.

```js
import {Parser} from 'decimal-eval';

const evaluate = new Parser('1 + abc').compile();
evaluate({ abc: 2 }); // '3'
evaluate({ abc: 9 }); // '10'
evaluate({ def: 1 }); // throw error, the scope name `abc` is not initialized
```

#### Parser.createBinaryOperator(value: string, precedence: number, calc: (left: string, right: string) => string): Operator
Create a binary operator.

#### Parser.createUnaryOperator(value: string, precedence: number, calc: (value: string) => string): Operator
Create a unary operator.

#### Parser.useOperator(operator: Operator): void
Install an operator which created by the `Parser.createBinaryOperator()` or `Parser.createUnaryOperator()` method.

#### Parser.useAdapter(adapter)
Set custom calculation adapter methods for four arithmetic (`+`, `-`, `*`, `/`).
[bignumber.js](https://github.com/MikeMcl/bignumber.js) is used by default.

```js
Parser.useAdapter({
  '+': (left, right) => String(Number(left) + Number(right)),
  '-': (left, right) => String(Number(left) - Number(right)),
  '*': (left, right) => String(Number(left) * Number(right)),
  '/': (left, right) => String(Number(left) / Number(right))
})
```


## Advanced

### Use pure package (no dependencies)
When using a custom method to deal with the decimal precision problem, you can use a pure package, which can reduce the size by about 60%.
It doesn't include `bignumber.js`.

```js
import {evaluate, Parser} from 'decimal-eval/dist/pure';

// set custom calculation adapter
// Parser.useAdapter(adapter);

// Does not deal with precision by default
evaluate('0.1 + 0.2'); // '0.30000000000000004'

// not supports big number by default
evaluate('9007199254740992 + 1'); // '9007199254740992'
```

### Re-export `bignumber.js`
Useful for deal JavaScript decimal precision problem without having to install [bignumber.js](https://github.com/MikeMcl/bignumber.js) again.

```js
import {BigNumber} from 'decimal-eval';
const val = new BigNumber(0.1).plus(0.2);
console.log(String(val)); // '0.3'
```

### Precedence of built-in operators
The operator precedence according to: [MDN operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).

|  operator   | precedence |
|  --------   | ---------- |
| `... + ...` | 13         |
| `... - ...` | 13         |
| `... * ...` | 14         |
| `... / ...` | 14         |
| `+ ...`     | 16         |
| `- ...`     | 16         |

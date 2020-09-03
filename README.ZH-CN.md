# decimal-eval
一个小巧、安全、快速的 JavaScript 库，用于计算算术表达式。

[![Travis (.org) branch](https://img.shields.io/travis/peakchen90/decimal-eval/master.svg)](https://travis-ci.org/peakchen90/decimal-eval)
[![Codecov](https://img.shields.io/codecov/c/github/peakchen90/decimal-eval.svg)](https://codecov.io/gh/peakchen90/decimal-eval)
[![npm](https://img.shields.io/npm/v/decimal-eval.svg)](https://www.npmjs.com/package/decimal-eval)
[![BUNDLE SIZE](https://badgen.net/bundlephobia/minzip/decimal-eval)](https://bundlephobia.com/result?p=decimal-eval)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peakchen90/decimal-eval/blob/master/LICENSE)

[English](./README.md) | 简体中文

## 特性
- 使用 [big.js](https://github.com/MikeMcl/big.js) 自动处理 JavaScript 小数精度
- 执行快、体积小，压缩后只有 16 KB, GZIP 后仅 5.8 KB
- 非常容易扩展自己的自定义运算符
- 支持表达式变量占位符

## 快速开始

### 安装
```
# 使用 npm
npm i -S decimal-eval

# 或使用 yarn
yarn add decimal-eval
```

### 使用
支持基本的四则运算 (`+`, `-`, `*`, `/`), 并默认使用 [big.js](https://github.com/MikeMcl/big.js) 自动处理 JavaScript 小数精度

```js
import {evaluate} from 'decimal-eval';

evaluate('0.1 + 0.2') // 0.3
evaluate('100 * (0.08 - 0.01)'); // 7
evaluate('1 + abc', { abc: 2 }); // 3
```

除了上述基本的运算符，也支持扩展自定义运算符，包括一元运算符和二元运算符。运算符的优先级根据:
[MDN 运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).

```js
import {evaluate, Parser, Operator} from 'decimal-eval';

// 创建一个二元运算符 "add", 优先级是 13
const addOp = Operator.create('add', 13, (left, right) => {
  return left + right;
});

// 创建一个一元运算符 "sin", 优先级是 16
const sinOp = Operator.create('sin', 16, (value) => {
  return Math.sin(value);
}, true);

// 安装自定义运算符
Parser.useOperator(addOp);
Parser.useOperator(sinOp);

// 下面的表达式与: `1 + Math.sin(-2)` 一样
evaluate('1 add sin -2') // 0.09070257317431829
```

## API
### `evaluate(expression: string, scope?: Record<string, number>): number`
解析表达式并计算结果

```js
import {evaluate} from 'decimal-eval';

evaluate('1 + 2'); // 3
evaluate('1 + abc', { abc: 2 }); // 3
```

### Operator
#### `Operator.create(value: string, precedence: number, calc: Function, isPrefix = false)`
```js
import {Operator} from 'decimal-eval';
// 创建一个二元运算符 "%", 它的计算方法像这样: `(left: number, right: number) => number`
const modOp = Operator.create('%', 15, (left, right) => left % right);

// 如果 `isPrefix` 是 true, 则会创建一个一元运算符，它的计算方法像这样: `(value: number) => number`
const absOp = Operator.create('abs', 16, (value) => Math.abs(value), true);
```

### Parser

#### `new Parser(expression: string).parse(): AST`
解析表达式，返回 AST

```js
import {Parser} from 'decimal-eval';

const ast = new Parser('1 + 2').parse();
```

#### `new Parser(expression: string).compile(): (scope) => number`
编译并缓存表达式，返回一个方法快速计算

```js
import {Parser} from 'decimal-eval';

const evaluate = new Parser('1 + abc').compile();
evaluate({ abc: 2 }); // 3
evaluate({ abc: 9 }); // 10
evaluate({ def: 1 }); // 抛出错误，变量 `abc` 未定义
```

#### `Parser.useOperator(operator)`
安装一个运算符，运算符通过 `Operator.create()` 方法创建

```js
import {Parser, Operator} from 'decimal-eval';

Parser.useOperator(
  Operator.create('%', 15, (a,b) => a % b)
)
```

#### `Parser.useAdapter(adapter)`
为四则运算 (`+`, `-`, `*`, `/`) 设置计算方法适配器，默认使用 [big.js](https://github.com/MikeMcl/big.js) 计算

```js
Parser.useAdapter({
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right
})
```

## 进阶

### 使用 Pure 包 (无依赖)
当需要使用自定义方法去处理小数精度问题时，你可以使用 Pure 包，可以减少 60% 的体积，这个包不包含 `big.js`

```js
import {evaluate, Parser} from 'decimal-eval/dist/pure';

// 设置自定义计算方法
// Parser.useAdapter(adapter);

// 默认不会自动处理小数精度问题
evaluate('0.1 + 0.2'); // 0.30000000000000004
```

### 再次导出 `big.js`
对处理 JavaScript 小数精度很有用

```js
import {Big} from 'decimal-eval';
const val = new Big(0.1).plus(0.2);
console.log(Number(val)); // 0.3
```

### 内置运算符优先级
运算符优先级根据: [MDN 运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).

|  operator   | precedence  |
|  --------   | ----------  |
| `... + ...` | 13         |
| `... - ...` | 13         |
| `... * ...` | 14         |
| `... / ...` | 14         |
| `+ ...`     | 16         |
| `- ...`     | 16         |

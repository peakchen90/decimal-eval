importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.20');
importScripts('https://cdn.jsdelivr.net/npm/benchmark@2.1.4');
importScripts('https://cdn.jsdelivr.net/npm/decimal-eval@0.0.1/dist/pure.min.js');
importScripts('https://cdn.jsdelivr.net/npm/mathjs@7.2.0');
importScripts('https://cdn.jsdelivr.net/npm/math-expression-evaluator@1.2.22/dist/browser/math-expression-evaluator.min.js');

// test expressions
var expressions = [
  '0.1 + 0.2',
  '(4 + (6 - 3)) /2',
  '123456789 * (987654321 - 87654321)'
];

var config = [
  {
    title: 'decimal-eval',
    version: '0.0.1',
    run: function (expr) {
      DecimalEval.evaluate(expr);
    }
  },
  {
    title: 'mathjs',
    version: '7.2.0',
    run: function (expr) {
      math.evaluate(expr);
    }
  },
  {
    title: 'math-expression-evaluator',
    version: '1.2.22',
    run: function (expr) {
      mexp.eval(expr);
    }
  }
];

let data = [];
initTestsData();

self.postMessage({
  type: 'init',
  expressions: expressions,
  config: config.map(function (item) {
    item = _.clone(item);
    delete item.run;
    return item;
  }),
  data: data.map(function (row) {
    return row.map(function (item) {
      item = _.clone(item);
      delete item.run;
      return item;
    });
  }),
});

self.onmessage = function (e) {
  var data = e.data;
  switch (data.type) {
    case 'runTest':
      runTests();
      break;
  }
};

function runTests() {
  var suite = new Benchmark.Suite();
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      var item = data[i][j];
      reportCell(i, j, 'running...');
      suite.add(i + '_' + j, function () {
        item.run(item.expression);
      });
    }
  }
  suite.on('cycle', function (event) {
    var target = event.target;
    var pos = target.name.split('_');
    var i = Number(pos[0]);
    var j = Number(pos[1]);
    reportCell(i, j, (target.hz / 1000).toFixed(2) + 'k (ops/sec)');
  });
  suite.on('complete', function () {
    self.postMessage({
      type: 'complete'
    });
  });
  suite.run({'async': false});
}

function initTestsData() {
  data = [];
  for (var i = 0; i < expressions.length; i++) {
    var expr = expressions[i];
    var row = [];
    for (var j = 0; j < config.length; j++) {
      var target = config[i];
      var item = _.clone(target);
      item.id = 'cell@' + i + '_' + j;
      item.expression = expr;
      item.value = '';
      row.push(item);
    }
    data.push(row);
  }
}

function reportCell(i, j, value) {
  self.postMessage({
    type: 'reportCell',
    i: i,
    j: j,
    value: value
  });
}

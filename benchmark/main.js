var table = document.querySelector('#table-wrapper .table');
var runButton = document.getElementById('run-btn');
runButton.disabled = true;

var running = false;
var worker = new Worker('worker.js');

runButton.addEventListener('click', function () {
  if (running) return;
  running = true;
  runButton.disabled = true;
  worker.postMessage({type: 'runTest'});
});

var expressions = [];
var config = [];
var data = [];

worker.onmessage = function (e) {
  var _data = e.data;
  switch (_data.type) {
    case 'init':
      runButton.disabled = false;
      expressions = _data.expressions;
      config = _data.config;
      data = _data.data;
      renderHeader();
      renderCells();
      break;
    case 'reportCell':
      var i = _data.i;
      var j = _data.j;
      var item = data[i][j];
      item.value = _data.value;
      item.node.innerHTML = item.value;
      console.log(_data);
      break;
    case 'complete':
      running = false;
      runButton.disabled = false;
      break;
  }
};

function renderHeader() {
  var tr = document.createElement('tr');
  var firstTh = document.createElement('th');
  firstTh.innerHTML = 'Expression';
  tr.appendChild(firstTh);

  for (let i = 0; i < config.length; i++) {
    var target = config[i];
    var th = document.createElement('th');
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');
    p1.innerHTML = target.title;
    p2.innerHTML = '(v' + target.version + ')';
    p2.className = 'sub-title';
    th.appendChild(p1);
    th.appendChild(p2);
    tr.appendChild(th);
  }
  table.appendChild(tr);
}

function renderCells() {
  for (let i = 0; i < data.length; i++) {
    var row = data[i];
    var tr = document.createElement('tr');
    var firstTd = document.createElement('td');
    firstTd.innerHTML = expressions[i];
    firstTd.className = 'strong-text';
    tr.appendChild(firstTd);
    for (let j = 0; j < row.length; j++) {
      var item = row[j];
      var td = document.createElement('td');
      td.id = item.id;
      td.innerHTML = item.value;
      item.node = td;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const gzipSize = require('gzip-size');

const distRoot = path.join(__dirname, '../dist');

const files = {
  'index.min.js': {
    size: null,
    gzipSize: null,
  },
  'pure.min.js': {
    size: null,
    gzipSize: null,
  }
};

execSync('npm run build', {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit'
});

Object.keys(files).forEach(name => {
  const filename = path.join(distRoot, name);
  files[name] = {
    size: fs.statSync(filename).size,
    gzipSize: gzipSize.fileSync(filename)
  };
});

function getBundleSize(name, isGZIP = false) {
  const target = files[name];
  let size = isGZIP ? target.gzipSize : target.size;
  return (size / 1024).toFixed(1);
}

console.log(`
===================== BUNDLE SIZE =====================
index       min: ${getBundleSize('index.min.js')} KB        gzip: ${getBundleSize('index.min.js', true)} KB
pure        min: ${getBundleSize('pure.min.js')} KB        gzip: ${getBundleSize('pure.min.js', true)} KB
`);

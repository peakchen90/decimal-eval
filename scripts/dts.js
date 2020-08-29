/* eslint-disable @typescript-eslint/no-var-requires */

/* 自动生成包的d.ts文件 */
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const del = require('del');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

const rootPath = path.join(__dirname, '..');

const compilerOptions = {};

// 编译ts命令行参数
let compilerArgs = '';
const excludeKeys = ['paths', 'rootDirs'];
Object.assign(compilerOptions, {
  declaration: true,
  declarationMap: true,
  declarationDir: 'types',
  emitDeclarationOnly: true
});
for (const key in compilerOptions) {
  if (excludeKeys.includes(key)) continue;
  const value = compilerOptions[key];
  if (typeof value === 'string') {
    compilerArgs += ` --${key} ${value}`;
  } else if (typeof value === 'boolean' && value) {
    compilerArgs += ` --${key}`;
  } else if (Array.isArray(value)) {
    compilerArgs += ` --${key} ${value.join(',')}`;
  }
}

// 生成临时 d.ts
execSync(`tsc ${compilerArgs} src/index.ts`, {
  cwd: rootPath,
  stdio: 'inherit'
});

// 提取单个d.ts
const apiExtractorJsonPath = path.join(rootPath, 'api-extractor.json');
const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
const extractorResult = Extractor.invoke(extractorConfig, {
  localBuild: false,
  showVerboseMessages: true
});

if (extractorResult.errorCount === 0) {
  console.log(chalk.green('API Extractor completed successfully'));
} else {
  throw new Error(`API Extractor completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`);
}

// 删除临时冗余 d.ts
del.sync(path.join(rootPath, compilerOptions.declarationDir));
del.sync(path.join(rootPath, 'dist/decimal-eval.d.ts'));

// packages/webcrack/scripts/apply-node-gyp-patch.cjs
// const { applyPatch } = require('apply-patch');
const { applyPatchToDir } = require('@pnpm/patching.apply-patch');
const fs = require('fs');
const path = require('path');

// 先找到 isolated-vm 的位置
const ivmPath = require.resolve('isolated-vm/package.json');
const ivmDir = path.dirname(ivmPath);

// 假设 node-gyp-build 在其 node_modules 下
const ngbPath = path.join(ivmDir, '../../', 'node_modules', 'node-gyp-build', 'package.json');

if (!fs.existsSync(ngbPath)) {
  throw new Error('Cannot find node-gyp-build under isolated-vm');
}

const moduleDir = path.dirname(ngbPath);
// console.log(`patchedDir: ${moduleDir}`)
// 找到 node-gyp-build 的实际位置（pnpm 会 symlink 到 .pnpm）
// const pkgPath = require.resolve('node-gyp-build/package.json');
// const moduleDir = path.dirname(pkgPath);
const patchFile = path.join(__dirname, '../patches/node-gyp-build.patch');

// applyPatch(patchFile);
applyPatchToDir({
  patchedDir: moduleDir,
  patchFilePath: patchFile,
  allowFailure: false
});

console.log('✅ Applied patch to node-gyp-build at:', moduleDir);

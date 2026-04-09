// packages/webcrack/scripts/apply-node-gyp-patch.cjs
// const { applyPatch } = require('apply-patch');
const { applyPatchToDir } = require('@pnpm/patching.apply-patch');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os')
const isMingw = os.type().startsWith('MINGW32_NT')

// 先找到 isolated-vm 的位置
const ivmPath = require.resolve('isolated-vm/package.json');
const ivmDir = path.dirname(ivmPath);

// 假设 node-gyp-build 在其 node_modules 下
const ngbPath = path.join(ivmDir, '../../', 'node_modules', 'node-gyp-build', 'package.json');

if (!fs.existsSync(ngbPath)) {
  throw new Error('Cannot find node-gyp-build under isolated-vm');
}

const ivmPatchFile = path.join(__dirname, '../patches/isolated-vm.patch');
applyPatchToDir({
  patchedDir: ivmDir,
  patchFilePath: ivmPatchFile,
  allowFailure: false
});

console.log('✅ Applied patch to isolated-vm at:', ivmDir);

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

const mingNodePath = 'C:\\msys64\\ucrt64\\bin\\node.exe'
if (fs.existsSync(mingNodePath)) {

// if (isMingw) {
// 2. 读取其 package.json
const pkg = JSON.parse(fs.readFileSync(path.join(ivmDir, 'package.json'), 'utf8'));

// 3. 检查是否有 prebuild 脚本
if (!pkg.scripts || !pkg.scripts.prebuild) {
  console.warn('⚠️ No "prebuild" script found in isolated-vm/package.json');
  // 可选：直接运行 node-gyp rebuild
  // console.log('Running node-gyp rebuild instead...');
  // execSync('npm run pebuild', { cwd: ivmDir, stdio: 'inherit' });
  // 或者：
  // execSync('node-gyp rebuild', { cwd: ivmPath, stdio: 'inherit' });
  return;
}

const scriptName = 'rebuild'
// const prebuildScript = pkg.scripts?.install;
// console.log('📝 prebuild script:', prebuildScript);
// let cmdToRun = prebuildScript;
  // 如果 prebuild 以 "node " 开头，替换 node 为 /ucrt64/bin/node
// if (prebuildScript.trim().startsWith('node ')) {
//   cmdToRun = '/ucrt64/bin/node ' + prebuildScript.trim().substring(5);
// } else if (prebuildScript.trim().startsWith('node\t')) {
//   cmdToRun = '/ucrt64/bin/node ' + prebuildScript.trim().substring(5);
// } else {
//   // 如果不是 node 脚本（比如 make、python 等），你可能需要额外处理
//   console.warn('⚠️ prebuild script does not start with "node", running as-is in UCRT64 shell');
//   cmdToRun = 'npx ' + prebuildScript;
// }
  // 使用 bash -l -c 来加载 UCRT64 环境（假设 MSYS2 已正确安装）
  // const fullCommand = `bash -l -c "cd ${winPathToPosix(ivmDir)} && npm run ${scriptName}"`;
  // const fullCommand = `bash -l -c "cd ${winPathToPosix(ivmDir)} && npx node-gyp-build"`;
  // const fullCommand = `bash -l -c "cd ${winPathToPosix(ivmDir)} && ls ../node-gyp-build/"`;
  const fullCommand = `bash -l -c "cd ${winPathToPosix(ivmDir)} && node ../node-gyp-build/bin.js"`;
  // const fullCommand = `bash -l -c "cd ${winPathToPosix(ivmDir)} && which node && echo \$MSYSTEM"`;

  console.log('🚀 Executing in UCRT64 environment:');
  console.log(fullCommand);

  try {
    execSync(fullCommand, {
      stdio: 'inherit',
      env: {
        ...process.env,
        MSYSTEM: 'UCRT64', // 确保 MSYS2 使用 UCRT64
        MSYSTEM_CHOST: 'x86_64-w64-mingw32',
        MSYSTEM_CARCH: 'x86_64'
      }
    });
    console.log('✅ prebuild completed successfully with /ucrt64/bin/node');
  } catch (err) {
    console.error('💥 prebuild failed:', err.message);
    process.exit(1);
  }
// 4. 执行 prebuild 脚本
// console.log('Running isolated-vm prebuild script...');
// execSync('npm run prebuild', {
//   cwd: ivmDir,
//   stdio: 'inherit', // 继承 stdout/stderr，方便看日志
//   env: { ...process.env, NODE_PATH: '' } // 避免 NODE_PATH 干扰
// });
}
function winPathToPosix(path) {
  if (typeof path !== 'string') return path;

  // 1. 统一使用正斜杠（兼容 C:\ 和 C:/）
  let normalized = path.replace(/\\/g, '/');

  // 2. 检查是否以盘符开头（如 C:/, d:/）
  const driveMatch = normalized.match(/^([a-zA-Z]):\/(.*)$/);
  if (driveMatch) {
    const driveLetter = driveMatch[1].toLowerCase(); // 'C' → 'c'
    const restPath = driveMatch[2];

    if (restPath === '') {
      // 处理 "C:" 或 "C:/" 这种情况
      return `/${driveLetter}/`;
    }

    // 3. 拆分剩余路径并过滤空段（避免 // 问题）
    const parts = restPath.split('/').filter(part => part !== '');
    return `/${driveLetter}/${parts.join('/')}`;
  }

  // 4. 非盘符路径（相对路径、已 POSIX 路径等）直接标准化
  const parts = normalized.split('/').filter(part => part !== '');
  if (normalized.startsWith('/')) {
    return '/' + parts.join('/');
  } else {
    return parts.join('/'); // 相对路径
  }
}

# `@bratel/webcrack`

This fork of [`webcrack`](https://webcrack.netlify.app/docs/) is intended as a stopgap measure until upstream is ready for my changes (see the [Upstreaming plan](#upstreaming-plan) section).

> [!NOTE]
> `@bratel/webcrack` has been published to NPM（`ItsHarper/webcrack`）
## Changes from upstream

* Compatible with node.js 22 and 24 (but not older)
* Uses babel 8 beta (TODO)
* Can be used from bundler-free Typescript projects without enabling `skipLibCheck` (and type-safety is improved with `skipLibCheck` enabled) (TODO)
  * Babel 8 being ESM-only is a core enabler of this

## Upstreaming plan

All of my changes can be upstreamed once upstream is ready to do the following:

* Update `isolated-vm` to version 6 or later
  * Requires node.js 18 usage to drop (see https://github.com/j4k0xb/webcrack/pull/184#issuecomment-3014185340)
* Update to babel 8
  * In beta as of August 2025

# Original `webcrack` README (minimally-adapted)

[![Test](https://github.com/j4k0xb/webcrack/actions/workflows/ci.yml/badge.svg)](https://github.com/lsq/webcrack/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/webcrack)](https://www.npmjs.com/package/webcrack)
[![license](https://img.shields.io/github/license/j4k0xb/webcrack)](https://github.com/lsq/webcrack/blob/master/LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ba64bf80-7053-4ed8-a282-d3762742c0dd/deploy-status)](https://app.netlify.com/sites/webcrack/deploys)

<p align="center">
  <img src="https://user-images.githubusercontent.com/55899582/231488871-e83fb827-1b25-4ec9-a326-b14244677e87.png" width="200">
</p>

<h1 align="center">webcrack</h1>

webcrack is a tool for reverse engineering javascript.
It can deobfuscate [obfuscator.io](https://github.com/javascript-obfuscator/javascript-obfuscator), unminify,
transpile, and unpack [webpack](https://webpack.js.org/)/[browserify](https://browserify.org/),
to resemble the original source code as much as possible.

Try it in the [online playground](https://webcrack.netlify.app/) or view the [documentation](https://webcrack.netlify.app/docs).

- 🚀 **Performance** - Various optimizations to make it fast
- 🛡️ **Safety** - Considers variable references and scope
- 🔬 **Auto-detection** - Finds code patterns without needing a config
- ✍🏻 **Readability** - Removes obfuscator/bundler artifacts
- ⌨️ **TypeScript** - All code is written in TypeScript
- 🧪 **Tests** - To make sure nothing breaks

## Requirements

Node.js 22 or 24.

## Command Line Interface

```bash
npm install -g @bratel/webcrack
```

Examples:

```bash
webcrack input.js
webcrack input.js > output.js
webcrack bundle.js -o output-dir
```

[CLI Reference](https://webcrack.netlify.app/docs/guide/cli.html)

## API

```bash
npm install @bratel/webcrack
```

Examples:

```js
import fs from 'fs';
import { webcrack } from '@bratel/webcrack';

const input = fs.readFileSync('bundle.js', 'utf8');

const result = await webcrack(input);
console.log(result.code);
console.log(result.bundle);
await result.save('output-dir');
```

[API Reference](https://webcrack.netlify.app/docs/guide/api.html)

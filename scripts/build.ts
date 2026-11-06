#!/usr/bin/env tsx

import { build } from 'esbuild';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';

const BUILD_DIR = './dist';
const ENTRY_POINT = './index.ts';

interface BuildConfig {
  name: string;
  format: 'esm' | 'cjs';
  outfile: string;
  target: string;
}

const buildConfigs: BuildConfig[] = [
  {
    name: 'ESM',
    format: 'esm',
    outfile: join(BUILD_DIR, 'index.esm.js'),
    target: 'es2022'
  },
  {
    name: 'CommonJS',
    format: 'cjs',
    outfile: join(BUILD_DIR, 'index.cjs.js'),
    target: 'es2020'
  }
];

async function cleanBuildDir() {
  await rm(BUILD_DIR, { recursive: true, force: true });
  await mkdir(BUILD_DIR, { recursive: true });
}

async function buildBundle(config: BuildConfig): Promise<boolean> {
  try {
    console.log(`Building ${config.name} bundle...`);

    const result = await build({
      entryPoints: [ENTRY_POINT],
      bundle: true,
      format: config.format,
      outfile: config.outfile,
      target: config.target,
      platform: 'node',
      external: ['ws', '@types/ws'],
      define: { 'process.env.NODE_ENV': '"production"' },
      sourcemap: true,
      minify: true,
      treeShaking: true,
      banner: { js: `/* TradeAPI SDK v1.0.0 - ${config.name} */` }
    });

    if (result.errors.length > 0) {
      console.error(`${config.name} build failed:`, result.errors);
      return false;
    }

    console.log(`${config.name} bundle built: ${config.outfile}`);
    return true;
  } catch (error) {
    console.error(`${config.name} build failed:`, error);
    return false;
  }
}

async function buildTypes() {
  try {
    console.log('Building TypeScript declarations...');
    const { execSync } = await import('child_process');
    execSync('npx tsc --project tsconfig.build.json', { stdio: 'inherit', cwd: process.cwd() });
    console.log('TypeScript declarations built');
    return true;
  } catch (error) {
    console.error('TypeScript declarations build failed:', error);
    return false;
  }
}

async function main() {
  console.log('Starting TradeAPI SDK build...\n');
  const startTime = Date.now();

  await cleanBuildDir();

  const buildResults = await Promise.all(buildConfigs.map(buildBundle));
  if (!buildResults.every(Boolean)) {
    console.error('Some builds failed');
    process.exit(1);
  }

  const typesBuilt = await buildTypes();
  if (!typesBuilt) process.exit(1);

  const duration = Date.now() - startTime;
  console.log(`\nBuild completed in ${duration}ms`);
  console.log(`Output: ${BUILD_DIR}/`);
  console.log('  ESM:   index.esm.js');
  console.log('  CJS:   index.cjs.js');
  console.log('  Types: *.d.ts');
}

main().catch(console.error);

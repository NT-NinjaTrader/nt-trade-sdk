#!/usr/bin/env bun

import { context } from 'esbuild';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';

const BUILD_DIR = './dist';
const ENTRY_POINT = './index.ts';

async function cleanBuildDir() {
  try {
    await rm(BUILD_DIR, { recursive: true, force: true });
    await mkdir(BUILD_DIR, { recursive: true });
    console.log('🧹 Cleaned build directory');
  } catch (error) {
    console.log('📁 Build directory already clean');
  }
}

async function startWatchMode() {
  try {
    console.log('👀 Starting watch mode...');

    const ctx = await context({
      entryPoints: [ENTRY_POINT],
      bundle: true,
      format: 'esm',
      outfile: join(BUILD_DIR, 'index.esm.js'),
      target: 'es2022',
      platform: 'node',
      external: ['ws', '@types/ws'],
      sourcemap: true,
      minify: false, // Don't minify in watch mode for faster builds
      treeShaking: true,
      define: {
        'process.env.NODE_ENV': '"development"'
      }
    });

    // Start watching
    await ctx.watch();

    console.log('✅ Watch mode started');
    console.log('📁 Watching for changes...');
    console.log('🔄 Press Ctrl+C to stop watching');

    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping watch mode...');
      await ctx.dispose();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start watch mode:', error);
    process.exit(1);
  }
}

async function main() {
  try {
    // Clean build directory
    await cleanBuildDir();

    // Start watch mode
    await startWatchMode();
  } catch (error) {
    console.error('❌ Watch mode failed:', error);
    process.exit(1);
  }
}

// Run the watch mode
main().catch(console.error);

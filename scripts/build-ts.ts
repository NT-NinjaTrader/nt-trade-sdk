#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { mkdir, rm } from 'fs/promises';

const BUILD_DIR = './dist';
const TSCONFIG = './tsconfig.build.json';

async function cleanBuildDir() {
  try {
    await rm(BUILD_DIR, { recursive: true, force: true });
    await mkdir(BUILD_DIR, { recursive: true });
    console.log('🧹 Cleaned build directory');
  } catch (error) {
    console.log('📁 Build directory already clean');
  }
}

async function buildTypeScript() {
  try {
    console.log('🔧 Building TypeScript with tsc...');

    execSync(`npx tsc --project ${TSCONFIG}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    console.log('✅ TypeScript compilation completed');
    return true;
  } catch (error) {
    console.error('❌ TypeScript compilation failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting TypeScript build...\n');

  const startTime = Date.now();

  try {
    // Clean build directory
    await cleanBuildDir();

    // Build TypeScript
    const buildSuccess = await buildTypeScript();
    if (!buildSuccess) {
      process.exit(1);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('\n🎉 TypeScript build completed successfully!');
    console.log(`⏱️  Total build time: ${duration}ms`);
    console.log(`📦 Output directory: ${BUILD_DIR}`);
    console.log('\n📋 Build outputs:');
    console.log('   • Compiled JavaScript: *.js');
    console.log('   • Type Declarations: *.d.ts');
    console.log('   • Source Maps: *.map');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build
main().catch(console.error);

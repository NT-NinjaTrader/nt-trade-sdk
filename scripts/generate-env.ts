#!/usr/bin/env bun

import { writeFileSync } from 'fs';
import { createSampleEnvFile } from '../sdks/configLoader';

function generateEnvFile(outputPath: string = '.env'): void {
  try {
    // Use the createSampleEnvFile function from configLoader to ensure consistency
    const envContent = createSampleEnvFile();

    writeFileSync(outputPath, envContent, 'utf8');
    console.log(`✅ Generated default .env file at: ${outputPath}`);
    console.log('📝 Please edit the file and set your actual API credentials');
    console.log('⚠️  Note: Valid stages are: staging, devel, prod');
  } catch (error) {
    console.error('❌ Failed to generate .env file:', error);
    process.exit(1);
  }
}

// If run directly
if (import.meta.main) {
  const outputPath = process.argv[2] || '.env';
  generateEnvFile(outputPath);
}

export { generateEnvFile };

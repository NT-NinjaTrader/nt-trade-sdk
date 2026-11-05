#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';

console.log('🚀 Setting up TradeAPI SDK development environment...\n');

interface SetupStep {
  name: string;
  description: string;
  action: () => Promise<boolean>;
}

const setupSteps: SetupStep[] = [
  {
    name: 'Check Dependencies',
    description: 'Verifying all required dependencies are installed',
    action: async () => {
      try {
        const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
        const requiredDeps = [
          'eslint',
          'prettier',
          'husky',
          'lint-staged',
          '@typescript-eslint/eslint-plugin',
          '@typescript-eslint/parser'
        ];

        const missingDeps = requiredDeps.filter(
          dep => !packageJson.devDependencies[dep] && !packageJson.dependencies[dep]
        );

        if (missingDeps.length > 0) {
          console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
          console.log('Run: npm install');
          return false;
        }

        console.log('✅ All dependencies are installed');
        return true;
      } catch (error) {
        console.error('❌ Error checking dependencies:', error);
        return false;
      }
    }
  },

  {
    name: 'Setup Husky Hooks',
    description: 'Installing Git pre-commit hooks',
    action: async () => {
      try {
        if (!existsSync('.husky/pre-commit')) {
          console.log('📦 Installing Husky hooks...');
          execSync('npm run prepare', { stdio: 'inherit' });
        } else {
          console.log('✅ Husky hooks already installed');
        }
        return true;
      } catch (error) {
        console.error('❌ Error setting up Husky:', error);
        return false;
      }
    }
  },

  {
    name: 'Verify Configuration Files',
    description: 'Checking all configuration files exist',
    action: async () => {
      const requiredFiles = [
        '.eslintrc.cjs',
        '.prettierrc.cjs',
        '.editorconfig',
        '.lintstagedrc.cjs',
        '.vscode/settings.json',
        '.vscode/extensions.json',
        '.vscode/tasks.json',
        '.vscode/launch.json'
      ];

      const missingFiles = requiredFiles.filter(file => !existsSync(file));

      if (missingFiles.length > 0) {
        console.log(`❌ Missing configuration files: ${missingFiles.join(', ')}`);
        return false;
      }

      console.log('✅ All configuration files present');
      return true;
    }
  },

  {
    name: 'Test ESLint',
    description: 'Running ESLint to verify configuration',
    action: async () => {
      try {
        console.log('🔍 Testing ESLint configuration...');
        execSync('npm run lint:check', { stdio: 'pipe' });
        console.log('✅ ESLint configuration is working');
        return true;
      } catch (error) {
        console.log('⚠️  ESLint found some issues (this is normal for initial setup)');
        return true; // Don't fail setup for linting issues
      }
    }
  },

  {
    name: 'Test Prettier',
    description: 'Running Prettier to verify configuration',
    action: async () => {
      try {
        console.log('🎨 Testing Prettier configuration...');
        execSync('npm run format:check', { stdio: 'pipe' });
        console.log('✅ Prettier configuration is working');
        return true;
      } catch (error) {
        console.log('⚠️  Prettier found formatting issues (this is normal for initial setup)');
        return true; // Don't fail setup for formatting issues
      }
    }
  },

  {
    name: 'Create VSCode Workspace',
    description: 'Setting up VSCode workspace configuration',
    action: async () => {
      try {
        const workspaceFile = 'tradeapi-sdk.code-workspace';
        const workspaceConfig = {
          folders: [
            {
              name: 'TradeAPI SDK',
              path: '.'
            }
          ],
          settings: {
            'typescript.preferences.importModuleSpecifier': 'relative',
            'editor.formatOnSave': true,
            'editor.defaultFormatter': 'esbenp.prettier-vscode'
          },
          extensions: {
            recommendations: [
              'ms-vscode.vscode-typescript-next',
              'esbenp.prettier-vscode',
              'dbaeumer.vscode-eslint',
              'editorconfig.editorconfig'
            ]
          }
        };

        writeFileSync(workspaceFile, JSON.stringify(workspaceConfig, null, 2));
        console.log(`✅ Created VSCode workspace: ${workspaceFile}`);
        return true;
      } catch (error) {
        console.error('❌ Error creating workspace:', error);
        return false;
      }
    }
  }
];

async function runSetup() {
  let successCount = 0;
  const totalSteps = setupSteps.length;

  for (const step of setupSteps) {
    console.log(`\n🔧 ${step.name}`);
    console.log(`   ${step.description}`);

    try {
      const success = await step.action();
      if (success) {
        successCount++;
      }
    } catch (error) {
      console.error(`   ❌ Unexpected error: ${error}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Setup Summary: ${successCount}/${totalSteps} steps completed`);

  if (successCount === totalSteps) {
    console.log('\n🎉 Development environment setup completed successfully!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Open the project in VSCode');
    console.log('   2. Install recommended extensions');
    console.log('   3. Run: npm run dev');
    console.log('   4. Start coding!');
  } else {
    console.log('\n⚠️  Some setup steps failed. Check the output above for details.');
    console.log('\n💡 You can run individual commands manually:');
    console.log('   - npm run prepare (for Husky)');
    console.log('   - npm run lint (for ESLint)');
    console.log('   - npm run format (for Prettier)');
  }
}

// Run the setup
runSetup().catch(console.error);

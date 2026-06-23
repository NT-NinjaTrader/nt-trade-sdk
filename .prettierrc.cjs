module.exports = {
  // Basic formatting
  semi: true,
  trailingComma: 'none',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // TypeScript specific
  parser: 'typescript',

  // Bracket spacing and line breaks
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'avoid',

  // End of line
  endOfLine: 'lf',

  // Object formatting - prefer vertical expansion for objects with 3+ properties
  singleAttributePerLine: false,

  // Overrides for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json',
        printWidth: 100
      }
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        printWidth: 100,
        proseWrap: 'always'
      }
    },
    {
      files: '*.yml',
      options: {
        parser: 'yaml',
        tabWidth: 2
      }
    }
  ]
};

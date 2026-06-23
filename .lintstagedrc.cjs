module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,js,tsx,jsx}': ['eslint --fix', 'prettier --write'],

  // JSON, Markdown, YAML files
  '*.{json,md,yml,yaml}': ['prettier --write'],

  // Configuration files
  '*.{rc,config}.{js,ts,json}': ['eslint --fix', 'prettier --write']
};

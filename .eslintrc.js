module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: {
      allowDefaultProject: ['apps/admin-server/tools/*.ts'],
    },
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended-type-checked', 'prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    '**/dist/**',
    '**/node_modules/**',
    'apps/server-rest/target/**',
    'apps/web/vendor/**',
  ],
};

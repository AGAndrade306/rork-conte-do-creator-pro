const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    settings: {
      'import/core-modules': ['hono', 'hono/cors', '@hono/trpc-server'],
    },
  },
]);

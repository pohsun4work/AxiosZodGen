import antfu from '@antfu/eslint-config';

export default antfu(
  {
    ignores: ['dist', 'node_modules'],
    rules: {
      'antfu/if-newline': 'off',
      'antfu/top-level-function': 'off',
      'import/order': ['off'],
      'jsdoc/multiline-blocks': ['warn', { noZeroLineText: false }],
      'no-console': 'warn',
      'perfectionist/sort-imports': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'unknown', 'type'],
      }],
      'style/arrow-parens': ['error', 'always'],
      'style/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      'style/comma-dangle': ['error', {
        objects: 'always-multiline',
        arrays: 'always-multiline',
      }],
      'style/linebreak-style': ['error', 'unix'],
      'style/max-statements-per-line': ['warn', { max: 2 }],
      'style/member-delimiter-style': ['error', {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
        multilineDetection: 'brackets',
      }],
      'style/semi': ['error', 'always'],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
    },
  }
);

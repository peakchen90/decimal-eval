module.exports = {
  extends: [
    'alloy',
    'alloy/typescript'
  ],
  env: {
    browser: true,
    node: true,
    jest: true
  },
  globals: {
    __VERSION__: 'readonly'
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-useless-constructor': 'off',
    'no-param-reassign': 'off',
    'quotes': ['error', 'single'],
    'prefer-template': 'error',
    'eqeqeq': 'off',
    'no-eq-null': 'off',
    'semi': 'error',
    'max-params': 'off',
    'no-return-assign': 'off',
    'no-undef': 'off',
    'one-var': 'off'
  }
};

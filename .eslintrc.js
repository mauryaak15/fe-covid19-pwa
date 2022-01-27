module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'airbnb-typescript',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        createDefaultProgram: true,
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },
    plugins: ['react', '@typescript-eslint', 'import', 'prettier'],
    rules: {
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'no-console': 'error',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variableLike',
                format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                leadingUnderscore: 'allow',
            },
        ],
        'no-underscore-dangle': ['error', {allowAfterThis: true}],
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
    },
    overrides: [],
};

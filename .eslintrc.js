module.exports = {
    parser: 'babel-eslint',
    env: {
        es6    : true,
        browser: true,
        amd    : true,
        mocha  : true,
        jquery : true,
    },
    globals: {
        dataLayer : true,
        texts_json: false,
    },
    rules: {
        camelcase                          : 0,
        semi                               : ['error', 'always'],
        'array-callback-return'            : 0,
        'func-names'                       : ['error', 'never'],
        'keyword-spacing'                  : ['error', { after: true }],
        'no-param-reassign'                : ['error', { props: false }],
        'no-script-url'                    : 0,
        'one-var'                          : ['error', { initialized: 'never', uninitialized: 'always' }],
        // react rules
        'import/no-extraneous-dependencies': [0, { extensions: ['.jsx'] }],
        'jsx-a11y/alt-text'                : 0,
        'jsx-quotes'                       : ['error', 'prefer-single'],
        'react/jsx-indent'                 : ['error', 4],
        'react/jsx-indent-props'           : ['error', 4],
        'react/prop-types'                 : 0,
        // TODO: to be removed
        'prefer-destructuring'             : 0,
        'no-restricted-globals'            : 0,
        'no-multi-assign'                  : 0,
    },
    extends: [
        'airbnb',
        'binary',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    parserOptions: {
        ecmaVersion : 6,
        ecmaFeatures: {
            jsx: true,
        },
    },
};

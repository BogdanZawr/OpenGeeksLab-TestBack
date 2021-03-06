module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'plugins': [
    'babel'
  ],
  'rules': {
    'linebreak-style': ["error", "unix"],
    // 'prefer-const': 0,
    // 'spaced-comment': 0,
    'padded-blocks': 0,
    // 'import/imports-first': 0,
    'import/prefer-default-export': 0,
    // 'import/no-extraneous-dependencies': 0,
    // 'comma-dangle': 0,
    // 'arrow-body-style': 0,
    // 'quote-props': 0,
    'no-unused-vars': 1,
    // 'consistent-return': 0,
    'max-len': 0,
    // 'no-use-before-define': ['error', { 'functions': false, 'classes': true }],
    'no-underscore-dangle': 0,
    'jsx-a11y/href-no-hash': 0,
    'class-methods-use-this': 0,
    // 'no-param-reassign': 0,
    'no-throw-literal': 0,
  },
  'parserOptions': {
    'ecmaVersion': 7,
    'sourceType': 'module',
    'ecmaFeatures': {
      'spread': true
    }
  }
}

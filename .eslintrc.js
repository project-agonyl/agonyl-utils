module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  overrides: [
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    "no-underscore-dangle": "off",
    "max-len":  [
      "error",
      {
        "code": 120,
        "ignoreComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true
      }
    ],
    "no-bitwise": "off",
    "no-plusplus": "off",
    "no-console": "off",
    "class-methods-use-this": "off",
    "default-case": "off",
    "max-classes-per-file": "off",
    "prefer-destructuring": "off",
    "no-continue": "off",
    "no-nested-ternary": "off",
    "linebreak-style": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
  }
}

// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  overrides: [
    {
      files: ["*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      rules: {
        "no-unused-vars": "off",
        "no-undef": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-interface": "off",
      },
    },
  ],
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "warn",
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "never"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "vue/require-default-prop": "off",
    indent: ["warn", 2, { "SwitchCase": 1 }],
    // "max-len": ["warn", { code: 420, tabWidth: 2 }],
    // "css/": "off",
    "prefer-const": "warn",
  },
}

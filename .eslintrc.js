// eslint-disable-next-line no-undef
module.exports = {
  // root: true,
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
      },
    },
  ],
  env: {
    browser: true,
    es2021: true,
  },
  // extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  // extends: ["plugin:vue/vue3-recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  extends: ["plugin:vue/vue3-recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "warn",
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "never"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "warn",
    "vue/require-default-prop": "off",
    // "vue/no-unused-vars": "off",
    // "typescript/unused": "off",
    // "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    // "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    // "no-unused-vars": "off",
    // "@typescript-eslint/no-unused-vars": "off",
  },
}

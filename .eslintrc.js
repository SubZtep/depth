export default {
  env: {
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
    "prettier/prettier": "error",
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "never"],
    // "vue/no-unused-vars": "off",
    // "typescript/unused": "off",
    // "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    // "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    // "no-unused-vars": "off",
    // "@typescript-eslint/no-unused-vars": "off",
  },
}

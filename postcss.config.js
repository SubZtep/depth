const postcssPresetEnv = require("postcss-preset-env")
// const postcsseasings = require("postcss-easings")

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        "nesting-rules": true,
      },
    }),
    // postcsseasings(),
    // postcssPresetEnv({
    //   stage: 0,
    //   features: {
    //     "logical-properties-and-values": false,
    //     "prefers-color-scheme-query": false,
    //     "gap-properties": false,
    //     "custom-properties": false,
    //     "place-properties": false,
    //   },
    // }),
  ],
}

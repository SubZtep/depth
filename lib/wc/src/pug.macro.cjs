const { createMacro, MacroError } = require("babel-plugin-macros")
const { render } = require("pug")

function pug2html({ references }) {
  references.default.forEach(({ parentPath }) => {
    if (parentPath.type === "TaggedTemplateExpression") {
      const pug = parentPath.get("quasi").evaluate().value
      const html = render(pug.trim())
      const source = `"${html.replaceAll('"', '\\"')}"`
      parentPath.replaceWithSourceString(source)
    } else {
      throw new MacroError("Where is the pug?")
    }
  })
}

module.exports = createMacro(pug2html)

const { createMacro } = require("babel-plugin-macros")
const { render } = require("pug")

function pug2html({ references }) {  references.default.forEach((path) => {
    const targetPath = path.parentPath
    if (targetPath.type === "TaggedTemplateExpression") {
      // const { start, end } = path.container.loc
      // const pug = path.hub.getCode().slice(start.index + 4, end.index - 1)
      const pug = targetPath.get("quasi").evaluate().value
      const html = render(pug.trim())
      targetPath.replaceWithSourceString(`"${html.replaceAll("\"", "\\\"")}"`)
    }
  })
}

module.exports = createMacro(pug2html)

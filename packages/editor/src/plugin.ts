import type { Plugin } from "vue"
import ComponentPanel from "./components/ComponentPanel"
import EditorPlayback from "./components/EditorPlayback"
import EditorPanel from "./components/EditorPanel"
import InputBoolean from "./components/InputBoolean"
import InputNumber from "./components/InputNumber"
import InputColor from "./components/InputColor"
import InputXY from "./components/InputXY"
import InputXYZ from "./components/InputXYZ"
import InputXYZW from "./components/InputXYZW"

export const EditorPlugin: Plugin = function (app) {
  app.component("ComponentPanel", ComponentPanel)
  app.component("EditorPlayback", EditorPlayback)
  app.component("EditorPanel", EditorPanel)
  app.component("InputBoolean", InputBoolean)
  app.component("InputNumber", InputNumber)
  app.component("InputColor", InputColor)
  app.component("InputXY", InputXY)
  app.component("InputXYZ", InputXYZ)
  app.component("InputXYZW", InputXYZW)
}

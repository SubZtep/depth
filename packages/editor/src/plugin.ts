import type { Plugin } from "vue"
import EditorPlayback from "./components/EditorPlayback"
import EditorPanel from "./components/EditorPanel"
import ComponentPanel from "./components/ComponentPanel"
import InputNumber from "./components/InputNumber"
import InputBoolean from "./components/InputBoolean"
import InputColor from "./components/InputColor"
import InputXY from "./components/InputXY"
import InputXYZ from "./components/InputXYZ"
import InputXYZW from "./components/InputXYZW"

export const EditorPlugin: Plugin = function (app) {
  app.component("EditorPlayback", EditorPlayback)
  app.component("EditorPanel", EditorPanel)
  app.component("ComponentPanel", ComponentPanel)
  app.component("InputNumber", InputNumber)
  app.component("InputBoolean", InputBoolean)
  app.component("InputColor", InputColor)
  app.component("InputXY", InputXY)
  app.component("InputXYZ", InputXYZ)
  app.component("InputXYZW", InputXYZW)
}

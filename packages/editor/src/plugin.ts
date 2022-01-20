import type { Plugin } from "vue"
// import { loadPhysicsEngine } from "./world"
// import SensorCollider from "./components/SensorCollider"
import EditorPanel from "./components/EditorPanel"

export const EditorPlugin: Plugin = async function (app) {
  app.component("EditorPanel", EditorPanel)
  // app.component("SensorCollider", SensorCollider)
  // await loadPhysicsEngine()
}

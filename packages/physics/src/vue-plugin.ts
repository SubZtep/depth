import type { Plugin } from "vue"
import { loadPhysicsEngine } from "./world"
import SensorCollider from "./components/SensorCollider"

export const PhysicsPlugin: Plugin = async function (app) {
  app.component("SensorCollider", SensorCollider)
  await loadPhysicsEngine()
}

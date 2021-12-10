import type { Plugin, Directive } from "vue"
import { getWorld, loadPhysicsEngine } from "./world"

export const PhysicsPlugin: Plugin = async function (app) {
  await loadPhysicsEngine()
  getWorld()
}

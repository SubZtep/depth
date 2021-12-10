import { useSingleton } from "@depth/misc"
import RAPIER, { World } from "@dimforge/rapier3d-compat"
import { loop3D } from "@depth/canvas"

export const gravity = { x: 0, y: -9.81, z: 0 }
export const loadPhysicsEngine = () => RAPIER.init().then(() => RAPIER)

export const getWorld = () => {
  const { singleton } = useSingleton()

  if (singleton.has("PhysicalWorld")) {
    return singleton.get("PhysicalWorld")
  }

  const world = new World(gravity)
  singleton.set("PhysicalWorld", world)

  loop3D(() => {
    world.step()
  })

  return world
}

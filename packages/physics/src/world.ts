import { useSingleton } from "@depth/misc"
import type { Vector } from "@dimforge/rapier3d-compat"
import RAPIER, { World } from "@dimforge/rapier3d-compat"
import { loop3D } from "@depth/canvas"

export async function loadPhysicsEngine() {
  return RAPIER.init().then(() => RAPIER)
}

function createWorld(gravity: Vector = { x: 0, y: -9.81, z: 0 }) {
  const world = new World(gravity)
  const eventQueue = new RAPIER.EventQueue(true)

  loop3D(() => {
    world.step(eventQueue)

    eventQueue.drainContactEvents((handle1, handle2, started) => {
      console.log("CONTACT EVENT", { handle1, handle2, started })
    })

    eventQueue.drainIntersectionEvents((handle1, handle2, intersecting) => {
      console.log("INTERSECTION EVENT", { handle1, handle2, intersecting })
    })
  })

  return world
}

export function getWorld(singletonName = "PhysicalWorld"): World {
  const { singleton } = useSingleton()

  if (!singleton.has(singletonName)) {
    singleton.set(singletonName, createWorld())
  }

  return singleton.get(singletonName)
}

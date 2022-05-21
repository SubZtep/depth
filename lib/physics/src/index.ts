import type { Vector } from "@dimforge/rapier2d-compat"
import { init, World, EventQueue, RigidBodyDesc } from "@dimforge/rapier2d-compat"

let world: World
let eventQueue: EventQueue

export async function createWorld(gravity: Vector = { x: 0, y: -9.81 }) {
  await init()
  world = new World(gravity)
  eventQueue = new EventQueue(true)
}

export function tickWorld() {
  // if (!world || !eventQueue) throw new Error("World not created")
  world.step(eventQueue)
}

export function createRigidBody() {
  const rigidBodyDesc = RigidBodyDesc.dynamic().setLinvel(1, 3)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  rigidBody.setLinvel({ x: 1, y: 3 }, true)
  return rigidBody
}

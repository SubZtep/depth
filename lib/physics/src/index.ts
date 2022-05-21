// import type RAPIER from "@dimforge/rapier2d"
import RAPIER from "@dimforge/rapier2d"
import type { RigidBody, World, EventQueue } from "@dimforge/rapier2d"
// import { World, EventQueue, RigidBodyDesc, ColliderDesc, Vector2 } from "@dimforge/rapier2d"
import Quaternion from "quaternion"

let engine: typeof RAPIER
let world: World
let eventQueue: EventQueue
let initCb: Fn

import("@dimforge/rapier2d").then(async (RAPIER) => {
  // await createWorld()
  // world
  engine = RAPIER
  const gravity = new RAPIER.Vector2(0, -9.81)
  world = new RAPIER.World(gravity)
  eventQueue = new RAPIER.EventQueue(true)

  // ground
  const bodyDesc = RAPIER.RigidBodyDesc.fixed()
  const body = world.createRigidBody(bodyDesc)
  const colDesc = RAPIER.ColliderDesc.cuboid(800, 80)
  world.createCollider(colDesc, body.handle)

  initCb?.()
})

export function setInitCb(cb: Fn) {
  initCb = cb
}

export async function createWorld() {
  // await init()
  const gravity = new RAPIER.Vector2(0, -9.81)
  world = new RAPIER.World(gravity)
  eventQueue = new RAPIER.EventQueue(true)
  createGround()
}

export function tickWorld() {
  // if (!world || !eventQueue) throw new Error("World not created")
  world.step(eventQueue)
}

function createGround() {
  const bodyDesc = RAPIER.RigidBodyDesc.fixed()
  const body = world.createRigidBody(bodyDesc)
  const colDesc = RAPIER.ColliderDesc.cuboid(800, 80)
  world.createCollider(colDesc, body.handle)
}

export function createRigidBody() {
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setLinvel(1, 3)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  // rigidBody.setLinvel({ x: 1, y: 3 }, true)
  return rigidBody
}

export function toCssMatrix(rigibBody: RigidBody) {
  const q = new Quaternion(rigibBody.translation())
    // .add(rigibBody.translation())
    // .add(rigibBody.rotation)
    .conjugate()
  return q.toMatrix().join(",")
}

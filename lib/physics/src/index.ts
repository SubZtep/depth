// import type { default as RAPIER2D } from "@dimforge/rapier2d"
import RAPIER from "@dimforge/rapier2d-compat"
import type { RigidBody, World, EventQueue } from "@dimforge/rapier2d-compat"
// import { World, EventQueue, RigidBodyDesc, ColliderDesc, Vector2 } from "@dimforge/rapier2d"
import Quaternion from "quaternion"

// let engine: typeof RAPIER
// let RAPIER: typeof RAPIER2D
// let RAPIER: any
let world: World
let eventQueue: EventQueue
let initCb: Fn

await RAPIER.init()

// initCb?.()

// import("@dimforge/rapier2d").then(async (engine) => {
//   // await createWorld()
//   // world
//   // engine = RAPIER
//   RAPIER = engine
//   const gravity = new RAPIER.Vector2(0, -9.81)
//   world = new RAPIER.World(gravity)
//   eventQueue = new RAPIER.EventQueue(true)

//   // ground
//   const bodyDesc = RAPIER.RigidBodyDesc.fixed()
//   const body = world.createRigidBody(bodyDesc)
//   const colDesc = RAPIER.ColliderDesc.cuboid(800, 80)
//   world.createCollider(colDesc, body.handle)

//   initCb?.()
// })

// const RAPIER = await import("@dimforge/rapier2d")

// const gravity = new RAPIER.Vector2(0, -9.81)
// world = new RAPIER.World(gravity)
// eventQueue = new RAPIER.EventQueue(true)

// ground
// const bodyDesc = RAPIER.RigidBodyDesc.fixed()
// const body = world.createRigidBody(bodyDesc)
// const colDesc = RAPIER.ColliderDesc.cuboid(800, 80)
// world.createCollider(colDesc, body.handle)

export function setInitCb(cb: Fn) {
  initCb = cb
}

export function createWorld() {
  // await init()
  const gravity = new RAPIER.Vector2(0, 9.81)
  world = new RAPIER.World(gravity)
  eventQueue = new RAPIER.EventQueue(true)
}

export function tickWorld() {
  // if (!world || !eventQueue) throw new Error("World not created")
  world.step(eventQueue)
}

export function createGround() {
  const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 400)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  const colliderDesc = RAPIER.ColliderDesc.cuboid(640 / 2, 80 / 2)
  const collider = world.createCollider(colliderDesc, rigidBody.handle)
  return { rigidBody, collider }
}

export function createPlayer() {
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 200) //.setLinvel(1, 3)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  const colliderDesc = RAPIER.ColliderDesc.cuboid(100 / 2, 100 / 2)
  const collider = world.createCollider(colliderDesc, rigidBody.handle)
  // rigidBody.setLinvel({ x: 1, y: 3 }, true)
  return { rigidBody, collider }
}

export function toCssMatrix(rigibBody: RigidBody) {
  const q = new Quaternion(rigibBody.translation())
    // .add(rigibBody.translation())
    // .add(rigibBody.rotation)
    .conjugate()
  return q.toMatrix().join(",")
}

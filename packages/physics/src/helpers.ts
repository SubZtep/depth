import { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { getWorld } from "./world"

export function createGround(width = 10, height = 10) {
  const ground = ColliderDesc.cuboid(width, 0.1, height)
  // ground.setTranslation(0, -0.1, 0)
  getWorld().createCollider(ground)
}

export function createSmallBody() {
  const world = getWorld()

  const rigidBodyDesc = RigidBodyDesc.newDynamic() //.setCanSleep(false)
  const rigidBody = world.createRigidBody(rigidBodyDesc)

  const colliderDesc = ColliderDesc.cuboid(0.6, 0.4, 0.7) //.setTranslation(0, 0.2, 0.1)
  const collider = world.createCollider(colliderDesc, rigidBody.handle)

  return rigidBody
}

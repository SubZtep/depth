import { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { getWorld } from "./world"

export function createGround(width = 10, height = 10) {
  const ground = ColliderDesc.cuboid(width, 0.1, height)
  // ground.setTranslation(0, -0.1, 0)
  getWorld().createCollider(ground)
}

interface CuboidBodyOptions {
  dimensions: [number, number, number]
  additionalMass?: number
  density?: number
}

export function createCuboidBody(options: CuboidBodyOptions) {
  const world = getWorld()

  const rigidBodyDesc = RigidBodyDesc.newDynamic() //.setCanSleep(false)
  if (options.additionalMass) {
    rigidBodyDesc.setAdditionalMass(options.additionalMass)
  }
  const rigidBody = world.createRigidBody(rigidBodyDesc)

  const colliderDesc = ColliderDesc.cuboid(...(options.dimensions.map(v => v / 2) as [number, number, number])) //.setTranslation(0, 0.2, 0.1)
  if (options.density) {
    colliderDesc.setDensity(options.density)
  }
  // colliderDesc.setFriction(1)
  /*const collider =*/ world.createCollider(colliderDesc, rigidBody.handle)

  return rigidBody
}

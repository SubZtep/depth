import { Collider, ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { getWorld } from "./world"

export function createGround(width = 10, height = 10): Collider {
  const ground = ColliderDesc.cuboid(width, 0.1, height)
  return getWorld().createCollider(ground)
}

export function createBoxCollider(width = 1, height = 1, depth = 1): Collider {
  const box = ColliderDesc.cuboid(width, height, depth)
  return getWorld().createCollider(box)
}

export function createBoxBody(additionalMass?: number): RigidBody {
  const rigidBodyDesc = RigidBodyDesc.newDynamic().setCcdEnabled(true)
  additionalMass && rigidBodyDesc.setAdditionalMass(additionalMass)
  return getWorld().createRigidBody(rigidBodyDesc)
}

interface CuboidBodyOptions {
  dimensions: [number, number, number]
  additionalMass?: number
  density?: number
}

export function createCuboidBody(options: CuboidBodyOptions): RigidBody {
  // const rigidBodyDesc = RigidBodyDesc.newDynamic().setCcdEnabled(true)
  // if (options.additionalMass) {
  //   rigidBodyDesc.setAdditionalMass(options.additionalMass)
  // }
  // const world = getWorld()
  // const rigidBody = world.createRigidBody(rigidBodyDesc)

  const colliderDesc = ColliderDesc.cuboid(...(options.dimensions.map(v => v / 2) as [number, number, number]))
  if (options.density) {
    colliderDesc.setDensity(options.density)
  }

  world.createCollider(colliderDesc, rigidBody.handle)
  return rigidBody
}

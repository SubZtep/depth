import { loop3D } from "@depth/three.js"
import RAPIER, {
  CoefficientCombineRule,
  ColliderDesc,
  RigidBody,
  RigidBodyDesc,
  World,
} from "@dimforge/rapier3d-compat"
import { Vector3 } from "three/src/math/Vector3"
export type Rapier = typeof RAPIER

const getRapier = () => RAPIER.init().then(() => RAPIER)

export async function useRapier() {
  await getRapier()

  const gravity = new Vector3(0, -9.81, 0)
  const physicsWorld = new World(gravity)

  loop3D(() => {
    physicsWorld.step()
  })

  const createRigidBody = (panelWidth = 10) => {
    const rigidBodyBuilder = RigidBodyDesc.newStatic().setTranslation(panelWidth/2, 1, panelWidth/2)
    const rigidBody = physicsWorld.createRigidBody(rigidBodyBuilder)
    const colliderBuilder = ColliderDesc.cuboid(panelWidth, 1, panelWidth)
    const collider = physicsWorld.createCollider(colliderBuilder, rigidBody.handle)
  }

  return {
    gravity,
    physicsWorld,
    createRigidBody,
  }
}

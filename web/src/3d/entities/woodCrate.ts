import { loop3D } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ActiveEvents, ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { woodCrateMaterial } from "../materials/woodCrateMaterial"
import * as THREE from "three"

const world = getWorld()

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const mesh = new THREE.Mesh(boxGeometry, woodCrateMaterial)
mesh.receiveShadow = true
mesh.castShadow = true

const rigidBodyDesc = RigidBodyDesc.newDynamic()
  .setCcdEnabled(true)
  .setAdditionalMass(2)
  .setAdditionalPrincipalAngularInertia({ x: 1, y: 1, z: 1 })
const colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5).setActiveEvents(ActiveEvents.CONTACT_EVENTS).setDensity(2)
// .setRestitution(1)
const rigidBody = world.createRigidBody(rigidBodyDesc)
const collider = world.createCollider(colliderDesc, rigidBody.handle)

const setPosition = (x: number, y: number, z: number) => {
  mesh.position.set(x, y, z)
  rigidBody.setTranslation({ x, y, z }, true)
}

loop3D(() => {
  const pos = rigidBody.translation()
  const rot = rigidBody.rotation()

  mesh.position.set(pos.x, pos.y, pos.z)
  mesh.setRotationFromQuaternion({ x: rot.x, y: rot.y, z: rot.z, w: rot.w } as THREE.Quaternion)
})

export { mesh, rigidBody, setPosition }

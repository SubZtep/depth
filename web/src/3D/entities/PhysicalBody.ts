import { PhysicalWorld } from "./PhysicalWorld"
import { ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { exec3D, loop3D } from "@depth/three.js"
import { fixedValues } from "@depth/misc"
import type { Object3D } from "three/src/core/Object3D"
import { Quaternion } from "three/src/math/Quaternion"

export class PhysicalBody extends PhysicalWorld {
  rigidBody: RigidBody
  object3D: Object3D
  #rotation: Quaternion

  constructor(object3d: Object3D) {
    super()
    this.object3D = object3d

    const dimensions = this.object3D.scale
    const hx = dimensions.x / 2
    const hy = dimensions.y / 2
    const hz = dimensions.z / 2

    this.#rotation = new Quaternion()

    // Create a dynamic rigid-body.
    const rigidBodyDesc = RigidBodyDesc.newDynamic().setCanSleep(false)
    this.rigidBody = this.physicalWorld.createRigidBody(rigidBodyDesc)

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = ColliderDesc.cuboid(hx, hy, hz).setTranslation(0, hy, 0)
    this.physicalWorld.createCollider(colliderDesc, this.rigidBody.handle)

    // Add to scene
    exec3D(({ scene }) => {
      // this.object3D.add(cameraControls.camera)
      scene.add(this.object3D)
    })

    // Apply physical simulation
    loop3D(() => {
      const pos = this.rigidBody.translation()
      this.object3D.position.set(pos.x, pos.y, pos.z)

      const rot = this.rigidBody.rotation()
      this.#rotation.set(rot.x, rot.y, rot.z, rot.w)
      this.object3D.setRotationFromQuaternion(this.#rotation)
    })
  }

  getPosition(toFixed?: number): PositionTuple {
    let pos = this.rigidBody.translation()
    if (toFixed !== undefined) {
      pos = fixedValues(pos, toFixed)
    }
    return [pos.x, pos.y, pos.z]
  }

  getRotation(toFixed?: number): RotationTuple {
    let rot = this.rigidBody.rotation()
    if (toFixed !== undefined) {
      rot = fixedValues(rot, toFixed)
    }
    return [rot.x, rot.y, rot.z, rot.w]
  }
}

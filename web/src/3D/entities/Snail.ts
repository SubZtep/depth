import getSnailShell from "~/3D/goodybag/snail-shell"
import getSnailTorch from "~/3D/lights/snail-torch"
import type { Group } from "three/src/objects/Group"
import { PhysicalBody } from "~/3D/entities/PhysicalBody"
import type { Ref } from "vue"
import { loop3D } from "@depth/three.js"
import type { Vector, Rotation } from "@dimforge/rapier3d-compat"
import { fixedValues, multiValues, sumValue } from "@depth/misc"
import { usePlayerStore } from "~/stores/player"
import type { Store } from "pinia"

export interface PlayerInput {
  joystick: Ref<Vector>
  action: Ref<boolean>
}

function syncToStore(store: Store, stateKey: "position" | "rotation", value: Vector | Rotation) {
  const fix = fixedValues(value, 6)
  if (Object.keys(value).some(key => fix[key] !== store[stateKey][key])) {
    store[stateKey] = fix
  }
}

function addVectors(v1: Vector, v2?: Vector) {
  console.log(v2)
  return {
    x: v1.x + (v2?.x ?? 0),
    y: v1.y + (v2?.y ?? 0),
    z: v1.z + (v2?.z ?? 0),
  }
}

export class Snail extends PhysicalBody {
  private constructor(shell: Group) {
    super(shell)
  }
  speed = 3

  setInput(input: PlayerInput) {
    const store = usePlayerStore()
    loop3D(() => {
      // const linvelWorld = this.rigidBody.linvel()
      // const linvelInput = multiValues<Vector>(input.joystick.value, this.speed)
      // this.rigidBody.setLinvel(addVectors(linvelInput, linvelWorld), true)

      // console.log([this.rigidBody.isMoving(), this.rigidBody.mass(), linvelWorld])

      // if (!this.rigidBody.isMoving()) {
      // this.rigidBody.setLinvel(addVectors(linvelInput, linvelWorld), true)
      this.rigidBody.setLinvel(multiValues<Vector>(input.joystick.value, this.speed), true)
      this.rigidBody.setAngvel(input.joystick.value, true)
      // }

      syncToStore(store, "position", this.rigidBody.translation())
      syncToStore(store, "rotation", this.rigidBody.rotation())
    })
  }

  jump() {
    this.rigidBody.applyForce({ x: 0, y: 0.1, z: 0 }, true)
  }

  push() {
    this.rigidBody.applyForce({ x: 0, y: 0, z: -0.1 }, true)
  }

  static initialize(snailShell: Group) {
    const { spotLight, spotLightHelper } = getSnailTorch()
    snailShell.add(spotLight)

    return new Snail(snailShell)
  }
}

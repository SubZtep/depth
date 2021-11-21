import getSnailShell from "~/3D/goodybag/snail-shell"
import getSnailTorch from "~/3D/lights/snail-torch"
import type { Group } from "three/src/objects/Group"
import { PhysicalBody } from "~/3D/entities/PhysicalBody"
import type { Ref } from "vue"
import { loop3D } from "@depth/three.js"

export interface PlayerInput {
  joystick: Ref<[number, number]>
  action: Ref<boolean>
}

export class Snail extends PhysicalBody {
  private constructor(shell: Group) {
    super(shell)
  }
  speed = 3

  setInput(input: PlayerInput) {
    loop3D(() => {
      let [x, z] = input.joystick.value
      x *= this.speed
      z *= this.speed

      this.rigidBody.setLinvel({ x, y: 0, z }, true)
    })
  }

  jump() {
    this.rigidBody.applyForce({ x: 0, y: 0.1, z: 0 }, true)
  }

  go() {
    this.rigidBody.applyForce({ x: 0, y: 0, z: -0.1 }, true)
  }

  static async initialize() {
    const snailShell = await getSnailShell()
    const { spotLight, spotLightHelper } = getSnailTorch()
    snailShell.add(spotLight)

    return new Snail(snailShell)
  }
}

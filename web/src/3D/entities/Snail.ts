import { useThrottleFn } from "@vueuse/core"
import { loop3D } from "@depth/three.js"
import { fixedValues, hasDifferences, multiValues } from "@depth/misc"
import { PhysicalBody } from "~/3D/entities/PhysicalBody"
import getSnailTorch from "~/3D/lights/snail-torch"
import { usePlayerStore } from "~/stores/player"

export interface PlayerInput {
  joystick: Ref<Vector>
  action: Ref<boolean>
}

interface PatchPartState {
  position: Vector
  rotation: Rotation
}

function isDifferrent(oldState: PatchPartState, newState: PatchPartState) {
  return (
    hasDifferences<PatchPartState["position"]>(oldState.position, newState.position) ||
    hasDifferences<PatchPartState["rotation"]>(oldState.rotation, newState.rotation)
  )
}

export class Snail extends PhysicalBody {
  private constructor(shell: Group) {
    super(shell)
  }
  speed = 3

  setInput(input: PlayerInput) {
    const store = usePlayerStore()

    const oldState: PatchPartState = {
      position: { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, z: Number.POSITIVE_INFINITY },
      rotation: {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY,
        z: Number.POSITIVE_INFINITY,
        w: Number.POSITIVE_INFINITY,
      },
    }

    const patchState = () => {
      const newState: PatchPartState = {
        position: fixedValues(this.rigidBody.translation(), 6),
        rotation: fixedValues(this.rigidBody.rotation(), 6),
      }
      if (isDifferrent(oldState, newState)) {
        store.$patch(() => newState)
        oldState.position = newState.position
        oldState.rotation = newState.rotation
      }
    }

    const throttledPatchState = useThrottleFn(patchState, 120)

    loop3D(() => {
      this.rigidBody.setLinvel(multiValues<Vector>(input.joystick.value, this.speed), true)
      this.rigidBody.setAngvel(input.joystick.value, true)

      // FIXME: throttle store perhaps
      throttledPatchState()
    })
  }

  jump() {
    this.rigidBody.applyForce({ x: 0, y: 0.1, z: 0 }, true)
  }

  push() {
    this.rigidBody.applyForce({ x: 0, y: 0, z: -0.1 }, true)
  }

  static initialize(snailShell: Group) {
    const { spotLight /*, spotLightHelper*/ } = getSnailTorch()
    snailShell.add(spotLight)

    return new Snail(snailShell)
  }
}

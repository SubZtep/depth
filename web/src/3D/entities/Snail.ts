import getSnailShell from "~/3D/goodybag/snail-shell"
import getSnailTorch from "~/3D/lights/snail-torch"
import type { Group } from "three/src/objects/Group"
import { PhysicalBody } from "~/3D/entities/PhysicalBody"

export class Snail extends PhysicalBody {
  private constructor(shell: Group) {
    super(shell)
  }

  static async initialize() {
    const snailShell = await getSnailShell()
    const { spotLight, spotLightHelper } = getSnailTorch()
    snailShell.add(spotLight)

    return new Snail(snailShell)
  }
}

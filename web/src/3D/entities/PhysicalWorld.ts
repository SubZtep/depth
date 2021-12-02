import RAPIER, { World, ColliderDesc } from "@dimforge/rapier3d-compat"
import { loop3D } from "@depth/three.js"
import { useSingleton } from "@depth/misc"

export const initPhysicsEngine = () => RAPIER.init().then(() => RAPIER)

export class PhysicalWorld {
  static readonly gravity = { x: 0, y: -9.81, z: 0 }
  readonly physicalWorld: World

  constructor() {
    const { singleton } = useSingleton()
    if (singleton.has("physicalWorld")) {
      this.physicalWorld = singleton.get("physicalWorld")
      return
    }

    const physicalWorld = new World(PhysicalWorld.gravity)
    singleton.set("physicalWorld", physicalWorld)
    this.physicalWorld = physicalWorld
    this.createGroundCollider()

    loop3D(() => {
      this.physicalWorld.step()
    })
  }

  createGroundCollider() {
    const groundColliderDesc = ColliderDesc.cuboid(100, 0.1, 100)
    groundColliderDesc.setTranslation(0, -0.1, 0)
    this.physicalWorld.createCollider(groundColliderDesc)
  }
}

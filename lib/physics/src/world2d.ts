import RAPIER from "@dimforge/rapier2d-compat"
import type { RigidBody, World, EventQueue } from "@dimforge/rapier2d-compat"
import { setCssVar, appendTemplateToContainer } from "@depth/template"

const gravity = new RAPIER.Vector2(0, 9.81)

type Object2D = {
  rigidBody: RAPIER.RigidBody
  collider: RAPIER.Collider
}

type Object2DKey = "player" | "ground"

/**
 * Instanstiate a new world:
 * ``
 */
export class World2D {
  width: number
  height: number
  world!: World
  eventQueue!: EventQueue
  objects: Map<Object2DKey, Object2D> = new Map()
  setPlayerTransform!: (value: string, important?: boolean | undefined) => void

  constructor(container: HTMLElement) {
    this.width = container.clientWidth
    this.height = container.clientHeight
    return (async (): Promise<World2D> => {
      await RAPIER.init()
      this.world = new RAPIER.World(gravity)
      this.eventQueue = new RAPIER.EventQueue(true)
      this.objects.set("ground", this.createGround(container.clientWidth, ~~(container.clientHeight / 10)))
      this.objects.set("player", this.createPlayer(100, 100))

      this.setPlayerTransform = setCssVar()("--player-transform")

      setCssVar()("--ground-transform")(this.cssMatrix2D(this.objects.get("ground")!.rigidBody, true))

      return this
    })() as unknown as World2D
  }

  get player() {
    return this.objects.get("player")!
  }

  step() {
    this.world.step(this.eventQueue)
    this.setPlayerTransform(this.cssMatrix2D(this.objects.get("player")!.rigidBody))
  }

  createGround(width: number, height: number) {
    const rigidBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, this.height - height))
    const collider = this.world.createCollider(RAPIER.ColliderDesc.cuboid(width / 2, height / 2), rigidBody.handle)
    return { rigidBody, collider }
  }

  createPlayer(width: number, height: number) {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setAdditionalMass(2) // .setTranslation(0, 200) //.setLinvel(1, 3)
    const rigidBody = this.world.createRigidBody(rigidBodyDesc)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2)
    const collider = this.world.createCollider(colliderDesc, rigidBody.handle)
    // rigidBody.setLinvel({ x: 1, y: 3 }, true)
    return { rigidBody, collider }
  }

  /**
   * Apply translate and rotation to transformation matrix
   * @param body - Source rigid body
   * @param translateOnly - Don't apply rotation
   * @returns CSS `transform` value {string}
   */
  cssMatrix2D(body: RigidBody, translateOnly = false) {
    const trans = body.translation()
    if (translateOnly) return `translate(${trans.x}px, ${trans.y}px)`
    const rot = body.rotation()
    const [rsin, rcos] = [Math.sin(rot), Math.cos(rot)]
    const matrix = [rsin, rcos, -rcos, rsin, trans.x, trans.y]
    return `matrix(${matrix.join(",")})`
  }
}

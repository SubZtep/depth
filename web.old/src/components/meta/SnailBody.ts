import { loop3D } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import type { RigidBody } from "@dimforge/rapier3d-compat"
import { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { whenever } from "@vueuse/core"
import { usePlayerStore } from "~/stores/player"

function initPos(rigidBody: RigidBody) {
  rigidBody.setTranslation({ x: 0, y: 1.5, z: 0 }, true)
}

export default defineComponent({
  props: {
    playerInput: { type: Object as PropType<PlayerInput>, required: false },
  },
  emits: ["rigid-body"],
  async setup(props, { slots, emit }) {
    const instance = getCurrentInstance()
    if (!instance) throw new Error("Not in Vue scope")

    const playerStore = usePlayerStore()

    const world = getWorld()
    const rigidBodyDesc = RigidBodyDesc.newDynamic()
      .setCcdEnabled(true)
      .setAdditionalMass(0.2)
      .setAdditionalPrincipalAngularInertia({ x: 0.3, y: 0, z: 0.4 })
    const colliderDesc = ColliderDesc.cuboid(0.6 / 2, 0.45 / 2, 0.7 / 2)
      // FIXME: add back(?) .setActiveEvents(ActiveEvents.CONTACT_EVENTS | ActiveEvents.INTERSECTION_EVENTS)
      .setDensity(2)
      .setRestitution(0.2)

    const rigidBody = world.createRigidBody(rigidBodyDesc)
    const collider = world.createCollider(colliderDesc, rigidBody.handle)

    playerStore.$patch({
      rigidBodyHandle: rigidBody.handle,
      colliderHandle: collider.handle,
    } as any)

    emit("rigid-body", rigidBody)

    initPos(rigidBody)

    let lastPos = { x: 0, y: 0, z: 0 }
    let lastRot = { x: 0, y: 0, z: 0, w: 1 }
    const position = ref<PositionTuple>([0, 0, 0])
    const rotation = ref<RotationTuple>([0, 0, 0, 1])

    if (props.playerInput) {
      whenever(props.playerInput.action, () => {
        rigidBody.applyForce({ x: 0, y: 100, z: 0 }, true)
      })
    }

    loop3D(() => {
      if (props.playerInput) {
        const [x, , z] = props.playerInput.joystick.value
        if (x !== 0 || z !== 0) {
          const { y } = rigidBody.linvel()
          rigidBody.setLinvel({ x, y, z }, true)
        }
      }

      const pos = rigidBody.translation() // FIXME: toFixed(5) if neecessary

      if (pos.y < -10) {
        // reset the fallen
        initPos(rigidBody)
        return
      }

      if (pos.x !== lastPos.x || pos.y !== lastPos.y || pos.z !== lastPos.z) {
        position.value = [pos.x, pos.y, pos.z]
        lastPos = { ...pos }
      }

      const rot = rigidBody.rotation()
      if (rot.x !== lastRot.x || rot.y !== lastRot.y || rot.z !== lastRot.z || rot.w !== lastRot.w) {
        rotation.value = [rot.x, rot.y, rot.z, rot.w]
        lastRot = { ...rot }
      }
    })

    return () => slots.default?.({ position, rotation })
  },
})

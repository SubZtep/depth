import { loop3D } from "@depth/canvas"
import { createCuboidBody } from "@depth/physics"
import { whenever } from "@vueuse/core"

function initPos(rigidBody: any) {
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

    const rigidBody = createCuboidBody({
      dimensions: [0.6, 0.4, 0.7],
      additionalMass: 0.2,
      density: 2,
    })
    emit("rigid-body", rigidBody)

    initPos(rigidBody)

    let lastPos = { x: 0, y: 0, z: 0 }
    let lastRot = { x: 0, y: 0, z: 0, w: 1 }
    const position = ref<PositionTuple>([0, 0, 0])
    const rotation = ref<RotationTuple>([0, 0, 0, 1])

    if (props.playerInput) {
      whenever(props.playerInput.action, () => {
        rigidBody.applyForce({ x: 0, y: 500, z: 0 }, true)
      })
    }

    loop3D(() => {
      if (props.playerInput) {
        const [x, _, z] = props.playerInput.joystick.value
        if (x !== 0 || z !== 0) {
          const { y } = rigidBody.linvel()
          rigidBody.setLinvel({ x, y, z }, true)
        }
      }

      const pos = rigidBody.translation() // TODO: toFixed(5) if neecessary

      if (pos.y < -10) {
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

import { loop3D } from "@depth/canvas"
import { createSmallBody } from "@depth/physics"

export default defineComponent({
  emits: ["rigid-body"],
  async setup(_, { slots, emit }) {
    const instance = getCurrentInstance()
    if (!instance) throw new Error("Not in Vue scope")

    const rigidBody = createSmallBody()
    emit("rigid-body", rigidBody)

    rigidBody.setTranslation({ x: 0, y: 5, z: 0 }, true)

    let lastPos = { x: 0, y: 0, z: 0 }
    let lastRot = { x: 0, y: 0, z: 0, w: 1 }
    const position = ref<[number, number, number]>([0, 0, 0])
    const rotation = ref<[number, number, number, number]>([0, 0, 0, 1])

    loop3D(() => {
      const pos = rigidBody.translation() // TODO: toFixed(5) if neecessary

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

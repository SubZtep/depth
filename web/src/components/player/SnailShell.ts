import { loop3D } from "@depth/three.js"
import getSnailShell from "~/3D/goodybag/snail-shell-photo"
import { PhysicalBody } from "~/3D/entities/PhysicalBody"
import useSceneHelper from "~/composables/useSceneHelper"
import useResources from "~/composables/useResources"
import { usePlayerStore } from "~/stores/player"
import { useThrottleFn } from "@vueuse/core"
import { Object3D } from "three/src/core/Object3D"
import { Vector3 } from "three/src/math/Vector3"
import { Quaternion } from "three/src/math/Quaternion"

export default defineComponent({
  props: {
    input: { type: Object as PropType<PlayerInput>, required: true },
    startPosition: { type: Array as PropType<Array<number>>, default: () => [0, 0, 0] },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ input, startPosition }) {
    const { addForPage } = useSceneHelper()
    const { loader } = useResources()
    const playerStore = usePlayerStore()
    const loaded = ref(false)
    const rotationHelper = new Quaternion()
    const hasJoystickInput = computed(() => get(input.joystick).some(v => v !== 0))

    let object3D: Object3D
    let physicalBody: PhysicalBody

    // Rotation
    watch(
      input.joystick,
      ([x, _y, z]) => {
        if (!get(loaded) || !get(hasJoystickInput)) return

        rotationHelper.setFromAxisAngle({ x: 0, y: 1, z: 0 } as Vector3, Math.atan2(x, z))
        physicalBody.rigidBody.setRotation(
          { x: rotationHelper.x, y: rotationHelper.y, z: rotationHelper.z, w: rotationHelper.w },
          true
        )
      },
      { deep: true, immediate: true }
    )

    // Position
    const handleInput = () => {
      if (get(hasJoystickInput)) {
        const [x, y, z] = get(input.joystick)
        physicalBody.rigidBody.setLinvel({ x, y, z }, true)
      }
    }

    const handleStoreSync = () => {
      const data: { position?: PositionTuple; rotation?: RotationTuple } = {}
      const pos = physicalBody.getPosition(4)
      const rot = physicalBody.getRotation(4)
      if (pos.some((v, index) => playerStore.position[index] !== v)) data.position = pos
      if (rot.some((v, index) => playerStore.rotation[index] !== v)) data.rotation = rot
      if (data.position || data.rotation) playerStore.$patch(data as any)
    }

    const throttledStoreSync = useThrottleFn(handleStoreSync, import.meta.env.VITE_SUPABASE_THROTTLE)

    ;(async () => {
      object3D = await loader("SnailShell", getSnailShell)
      addForPage(object3D)
      physicalBody = new PhysicalBody(object3D)
      physicalBody.rigidBody.setTranslation({ x: startPosition[0], y: startPosition[1], z: startPosition[2] }, true)
      set(loaded, true)
      loop3D(() => {
        handleInput()
        throttledStoreSync()
      })
    })()

    return () => {
      // ignore slots
    }
  },
})

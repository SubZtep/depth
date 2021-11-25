import { Object3D, loop3D } from "@depth/three.js"
import useSceneHelper from "~/composables/useSceneHelper"
import useResources from "~/composables/useResources"
import getSnailShell from "~/3D/goodybag/snail-shell-photo"
import { PhysicalBody } from "~/3D/entities/PhysicalBody"
import { usePlayerStore } from "~/stores/player"
import { useThrottleFn } from "@vueuse/core"

export default defineComponent({
  props: {
    input: { type: Object as PropType<PlayerInput>, required: true },
    startPosition: { type: Array as PropType<Array<number>>, default: () => [0, 0, 0] },
    /** Throttle time in miliseconds */
    throttled: { type: Number, required: true },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ input, startPosition, throttled }) {
    const { addForPage } = useSceneHelper()
    const { loader } = useResources()
    const playerStore = usePlayerStore()

    let object3D: Object3D
    let physicalBody: PhysicalBody

    const hasJoystickInput = computed(() => get(input.joystick).some(v => v !== 0))

    const handleInput = () => {
      if (get(hasJoystickInput)) {
        const [x, y, z] = get(input.joystick)
        physicalBody.rigidBody.setLinvel({ x, y, z }, true)
        // TODO: rotate towards joystick direction
      }
    }

    const handleStoreSync = () => {
      const pos = physicalBody.getPosition(4)
      if (pos.some((v, index) => playerStore.position[index] !== v)) {
        playerStore.position = pos
      }
    }

    const throttledStoreSync = useThrottleFn(handleStoreSync, throttled)

    ;(async () => {
      object3D = await loader("SnailShell", getSnailShell)
      addForPage(object3D)
      physicalBody = new PhysicalBody(object3D)
      physicalBody.rigidBody.setTranslation({ x: startPosition[0], y: startPosition[1], z: startPosition[2] }, true)
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

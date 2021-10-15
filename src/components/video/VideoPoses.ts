import type { Results } from "~/packages/PoseAI"
import { round, compare } from "mathjs"
import { useMediapipePose } from "~/packages/PoseAI"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "~/packages/ThreeJS"

export default defineComponent({
  props: {
    el: {
      type: Object as PropType<HTMLVideoElement>,
      required: true,
    },
    keyframes: {
      type: Array as PropType<number[]>,
      required: true,
    },
    autoStart: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  emits: {
    pose: (ts: number, results: Results) => results.poseLandmarks.length > 0,
  },
  setup(props, { slots, emit }) {
    const el = toRef(props, "el")

    const toast = useToast()
    const threeJs = useThreeJSEventHook()
    // FIXME: maybe https://vueuse.org/shared/createSharedComposable/
    const { currentTime } = useMediaControls(el)

    let keyframes: number[] = []

    const { estimatePose, detectorReady } = useMediapipePose({
      video: el,
      options: { modelComplexity: 2 },
      handler: results => {
        emit("pose", get(currentTime), results)
      },
    })

    let t: number | undefined

    const rollKeyframes = async () => {
      await estimatePose(get(currentTime))
      t = keyframes.shift()

      if (t === undefined) {
        toast.success("Keyframes done")
        threeJs.trigger(resumeLoop)
        return
      }

      set(currentTime, t)
    }

    useEventListener<VideoElementEvent>(el, "timeupdate", async ({ target: { currentTime: ct } }) => {
      const isPoseTimeAndVideoTimeReallyDifferent = t && t !== ct && compare(round(t, 3), round(ct, 3)) !== 0

      if (isPoseTimeAndVideoTimeReallyDifferent) {
        throw new Error(`Video time update fail [${t} vs ${ct}]`)
      }
      await rollKeyframes()
    })

    whenever(and(detectorReady, props.autoStart), async () => {
      keyframes = toRaw(props.keyframes)
      if (keyframes.length === 0) {
        throw new Error("No keyframes")
      }

      threeJs.trigger(pauseLoop)
      await sleep(50)

      t = keyframes.shift()
      if (t === get(currentTime)) {
        await rollKeyframes()
      } else {
        set(currentTime, t)
      }
    })

    return () => slots.default && slots.default()
  },
})

import { assert } from "console"
import { useFFmpeg } from "~/packages/FFmpeg"

export default defineComponent({
  setup(_, { slots }) {
    const { progress } = useNProgress()
    const videoStore = useVideoStore()

    const { id, src, keyframes } = storeToRefs(videoStore)

    whenever(and(id, src, not(keyframes)), () => {
      const {
        keyframes: kf,
        isActive,
        exit,
      } = useFFmpeg({
        // @ts-ignore
        src,
        options: { progress: ({ ratio }) => set(progress, ratio), log: false },
      })

      watch(isActive, async active => {
        if (active) {
          await videoStore.setKeyframes(get(kf))
          exit()
        }
      })
    })

    return () => slots.default && slots.default({ keyframes })
  },
})

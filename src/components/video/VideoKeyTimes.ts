import { useFFmpeg } from "~/packages/FFmpeg"

export default defineComponent({
  props: {
    src: {
      src: String,
      required: true,
    },
  },
  emits: {
    done: (keyframes: number[]) => keyframes.length > 0,
  },
  setup(props, { slots, emit }) {
    const { progress, done } = useNProgress()
    const src = toRef(props, "src") as Ref<string>

    const { keyframes, isActive } = useFFmpeg({
      src,
      options: { progress: ({ ratio }) => set(progress, ratio), log: false },
    })

    whenever(and(src, isActive), () => emit("done", get(keyframes)))
    whenever(and(src, not(isActive)), () => void done(true))

    return () => slots.default && slots.default({ keyframes })
  },
})

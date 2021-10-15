import { useFFmpeg } from "~/packages/FFmpeg"
import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"

export default defineComponent({
  props: {
    src: {
      type: Object as PropType<HTMLVideoElement>,
      // type: String,
      required: true,
    },
  },
  // name: "VideoKeyframes",
  setup({ src }, { slots, emit }) {
    const toast = useToast()

    // const videoStore = useVideoStore()
    // const { src, hasId, hasKeyframes } = storeToRefs(videoStore)
    // const { progress, start, done } = useNProgress()


    whenever(and(hasId, not(hasKeyframes)), async () => {
      toast.info("FFmpeg grab keyframe timestamps")

      const ff = await useFFmpeg({
        // src: toRef(state, "src"),
        src,
        options: { progress: ({ ratio }) => set(progress, ratio), log: false },
      })
      await ff.runKeyframes()
      await videoStore.setKeyframes(get(ff.keyframes))
      ff.exit()

      if (ff.ffmpeg.isLoaded()) {
        toast.warning(
          {
            component: CancellableEventToast,
            props: {
              message: "Unable to exit from FFmpeg, going to RELOAD the page to get back your memory!",
              event: () => location.reload(),
            },
          },
          { timeout: 10000, position: POSITION.BOTTOM_CENTER }
        )
        return
      }
    })
    //

    return () => slots.default && slots.default()
  },
})

// import { useFFmpeg } from "~/packages/FFmpeg"
// import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"

// export default defineComponent({
//   // name: "VideoKeyframes",
//   setup(props, { slots, emit }) {
//     const toast = useToast()

//     const videoStore = useVideoStore()
//     const { src, hasId, hasKeyframes } = storeToRefs(videoStore)
//     const { progress, start, done } = useNProgress()


//     whenever(and(hasId, not(hasKeyframes)), async () => {
//       toast.info("FFmpeg grab keyframe timestamps")

//       const ff = await useFFmpeg({
//         // src: toRef(state, "src"),
//         src,
//         options: { progress: ({ ratio }) => set(progress, ratio), log: false },
//       })
//       await ff.runKeyframes()
//       await videoStore.setKeyframes(get(ff.keyframes))
//       ff.exit()

//       if (ff.ffmpeg.isLoaded()) {
//         toast.warning(
//           {
//             component: CancellableEventToast,
//             props: {
//               message: "Unable to exit from FFmpeg, going to RELOAD the page to get back your memory!",
//               event: () => location.reload(),
//             },
//           },
//           { timeout: 10000, position: POSITION.BOTTOM_CENTER }
//         )
//         return
//       }
//     })
//     //

//     return () => slots.default && slots.default()
//   },
// })

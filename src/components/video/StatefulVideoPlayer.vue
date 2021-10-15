<template lang="pug">
//- :controls="props.controls"
video.video-border.max-h-300px(
  controls
  ref="videoRef"
  @loadedmetadata="videoToStore"
  @timeupdate="emit('timeupdated')"
  v-css-aspect-ratio="`--video-aspect-ratio`"
  crossorigin="anonymous"
  poster="textures/no-video.png"
  muted
  v-visible="state.showVideoTag")
  source(
    v-if="state.src"
    @error="loadError"
    :src="`${state.src}\#t=0.1`")
</template>

<script lang="ts" setup>
import settings from "~/../SETTINGS.toml"
import { toSelectOptions } from "~/misc/utils"
import { useGuiFolder } from "~/packages/datGUI"
import { VIDEO_URL } from "~/misc/regexp"

const toast = useToast()
const { progress, start, done } = useNProgress()
const videoStore = useVideoStore()

const { hasId, hasKeyframes } = storeToRefs(videoStore)

const props = defineProps<{
  controls: boolean
}>()

const emit = defineEmits<{
  (e: "loaded", el?: HTMLVideoElement): void
  (e: "timeupdated"): void
}>()

const videoRef = ref() as Ref<HTMLVideoElement>

const state = reactive({
  showVideoTag: true,
  src: "",
})

const videoToStore = (async ({ target }: VideoElementEvent) => {
  start()
  await videoStore.replace({
    src: state.src,
    duration: target.duration,
    width: target.videoWidth,
    height: target.videoHeight,
  })
  done()
  // await until(hasId).toBe(true)
  // console.log("video loaded", videoStore.id)
  emit("loaded", get(videoRef))
}) as (payload: Event) => Promise<void>

const videoSelectOptions: Ref<SelectOptions> = ref(toSelectOptions(settings.video?.clips ?? []))

const loadError = () => {
  delete get(videoSelectOptions)[basename(state.src)]
  toast.error(`Load video error ${state.src}`)
}

watch(
  () => state.src,
  (_newSrc, oldSrc) => {
    // FIXME: Change quickly: The play() request was interrupted by a call to pause(). https://goo.gl/LdLk22
    const el = get(videoRef)
    if (oldSrc) {
      el.pause()
    }
    videoStore.$reset()
    el.load()
  }
)

// whenever(and(hasId, not(hasKeyframes)), async () => {
//   toast.info("FFmpeg grab keyframe timestamps")

//   const ff = await useFFmpeg({
//     src: toRef(state, "src"),
//     options: { progress: ({ ratio }) => set(progress, ratio), log: false },
//   })
//   await ff.runKeyframes()
//   await videoStore.setKeyframes(get(ff.keyframes))
//   ff.exit()

//   if (ff.ffmpeg.isLoaded()) {
//     toast.warning(
//       {
//         component: CancellableEventToast,
//         props: {
//           message: "Unable to exit from FFmpeg, going to RELOAD the page to get back your memory!",
//           event: () => location.reload(),
//         },
//       },
//       { timeout: 10000, position: POSITION.BOTTOM_CENTER }
//     )
//     return
//   }
// })

useGuiFolder(folder => {
  folder.name = "📼 Video Player"
  folder.add(state, "showVideoTag").name("Show video")
  folder.addReactiveSelect({ target: state, propName: "src", options: videoSelectOptions }).name("Load video")
  folder
    .addTextInput({ filter: VIDEO_URL, placeholder: "blur to add" })
    .name("Video URL")
    .onFinishChange(url => {
      get(videoSelectOptions)[basename(url)] = url
      state.src = url
    })
})
</script>

<template lang="pug">
video(
  ref="videoRef"
  :class="$style.video"
  :controls="props.controls"
  @loadedmetadata="videoToStore"
  @timeupdate="emit('timeupdated')"
  v-css-aspect-ratio="`--video-aspect-ratio`"
  crossorigin="anonymous"
  muted)
  source(
    v-if="!!props.src"
    @error="loadError"
    :src="props.src")
</template>

<script lang="ts" setup>
const toast = useToast()
const { start, done } = useNProgress()
const videoStore = useVideoStore()

const props = defineProps<{
  src: string
  controls: boolean
}>()

const emit = defineEmits<{
  (e: "error", src: string): void
  (e: "loaded", el?: HTMLVideoElement): void
  (e: "timeupdated"): void
}>()

const videoRef = ref() as Ref<HTMLVideoElement>

watch(
  () => props.src,
  src => {
    const el = get(videoRef)
    el.srcObject = null
    videoStore.$reset()
    emit("loaded", src ? el : undefined)
  }
)

const videoToStore = (async ({ target }: VideoElementEvent) => {
  start()
  await videoStore.replace({
    src: props.src,
    duration: target.duration,
    width: target.videoWidth,
    height: target.videoHeight,
  })
  done()
  emit("loaded", get(videoRef))
}) as (payload: Event) => Promise<void>

const loadError = () => {
  emit("error", props.src)
  toast.error(`Load video error ${props.src}`)
}
</script>

<style module>
.video {
  @apply max-h-300px;
  aspect-ratio: var(--video-aspect-ratio);
  border: 4px ridge #964b00;
}
</style>

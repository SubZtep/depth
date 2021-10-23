<template lang="pug">
video.video-border.max-h-300px(
  ref="videoRef"
  crossorigin="anonymous"
  poster="/textures/no-video.png"
  @loadedmetadata="videoLoaded"
  muted)
  //- v-visible="state.showVideoTag")
  source(
    v-if="props.src"
    @error="loadError"
    :src="`${props.src}\#t=0.1`")
</template>

<script lang="ts" setup>
const toast = useToast()

const props = defineProps<{
  src: string
}>()

const emit = defineEmits<{
  (e: "mounted", el: HTMLVideoElement): void
  (e: "error", src: string): void
  (e: "loaded", obj?: any): void
  // (e: "loaded", obj?: Db.Video): void
  (e: "timeupdated"): void
}>()

const videoRef = ref<HTMLVideoElement>()

onMounted(() => {
  emit("mounted", get(videoRef)!)
})

watch(
  () => props.src,
  () => {
    const el = get(videoRef)
    if (!el) return
    el.srcObject = null
    emit("loaded", undefined)
  }
)

const videoLoaded = (async ({ target }: VideoElementEvent) => {
  emit("loaded", {
    src: props.src,
    duration: target.duration,
    width: target.videoWidth,
    height: target.videoHeight,
  })
}) as (payload: Event) => Promise<void>

const loadError = () => {
  toast.error(`Load video error ${props.src}`)
  throw new Error(get(videoRef)?.error?.message ?? `Load error ${props.src}`)
}
</script>

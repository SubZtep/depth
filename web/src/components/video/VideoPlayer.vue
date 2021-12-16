<template lang="pug">
video.video-border.max-h-300px(
  ref="videoRef"
  crossorigin="anonymous"
  poster="/textures/no-video.png"
  @loadedmetadata="videoLoaded"
  :autoplay="props.play"
  :loop="props.play"
  muted)
  source(
    v-if="props.src"
    @error="loadError"
    :src="`${props.src}\#t=0.1`")
</template>

<script lang="ts" setup>
const toast = useToast()

const props = defineProps<{
  src: string
  play?: boolean
}>()

const emit = defineEmits<{
  (e: "mounted", el: HTMLVideoElement): void
  (e: "error", src: string, ev: Event): void
  (e: "loaded", obj?: any): void
  (e: "timeupdated"): void
}>()

const video = ref<HTMLVideoElement>()

onMounted(() => {
  emit("mounted", get(video)!)
})

watch(
  () => props.src,
  () => {
    const el = get(video)!
    el.srcObject = null
    emit("loaded")
  },
  { flush: "post" }
)

const videoLoaded: any = async ({ target }: VideoElementEvent) => {
  emit("loaded", {
    src: props.src,
    duration: target.duration,
    width: target.videoWidth,
    height: target.videoHeight,
  })
}

const loadError = (event: Event) => {
  toast.error(`Load video error ${props.src}`)
  emit("error", props.src, event)
}
</script>

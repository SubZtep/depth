<template lang="pug">
video.video-border.max-h-300px(
  ref="videoRef"
  crossorigin="anonymous"
  poster="/textures/no-video.png"
  @loadedmetadata="videoLoaded"
  muted)
  source(
    v-if="props.src"
    @error="loadError"
    :src="`${props.src}\#t=0.1`")
</template>

<script lang="ts" setup>
const toast = useToast()

const props = defineProps<{ src: string }>()

const emit = defineEmits<{
  (e: "mounted", el: HTMLVideoElement): void
  (e: "error", src: string, ev: Event): void
  (e: "loaded", obj?: Db.Video): void
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

const videoLoaded: any = async ({ target }: VideoElementEvent) => {
  emit("loaded", {
    src: props.src,
    duration: target.duration,
    width: target.videoWidth,
    height: target.videoHeight,
  })
}

const loadError = (ev: Event) => {
  toast.error(`Load video error ${props.src}`)
  emit("error", props.src, ev)
}
</script>

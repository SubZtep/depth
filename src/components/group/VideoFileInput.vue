<template lang="pug">
video(
  ref="videoRef"
  loop="true"
  muted="true"
  autoplay="true"
  controls="true"
  playsinline="true"
  poster="/textures/no-video.png")
</template>

<script lang="ts" setup>
import { useMediaControls, useEventListener } from "@vueuse/core"
import { onMounted, onBeforeUnmount, ref, toRef, watch } from "vue"

const videoRef = ref<HTMLVideoElement>()
const emptyRef = ref<HTMLVideoElement>()
const props = defineProps({ src: { type: String, required: true } })
const src = toRef(props, "src")

const { playing } = useMediaControls(videoRef, { src })
const emit = defineEmits(["updated", "dimensions"])

useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
  const { videoWidth, videoHeight } = target
  emit("dimensions", { videoWidth, videoHeight })
})

onMounted(() => {
  watch(playing, isPlaying => emit("updated", isPlaying ? videoRef : emptyRef), { immediate: true })
})

onBeforeUnmount(() => {
  emit("updated", emptyRef)
})
</script>

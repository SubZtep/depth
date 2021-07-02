<template lang="pug">
video(
  ref="videoRef"
  loop="true"
  muted="true"
  autoplay="true"
  controls="true"
  playsinline="true"
  poster="no-video.png")
</template>

<script lang="ts" setup>
import { useMediaControls } from "@vueuse/core"
import { onMounted, onBeforeUnmount, ref, toRef, watch } from "vue"

const videoRef = ref<HTMLVideoElement>()
const emptyRef = ref<HTMLVideoElement>()
const props = defineProps({ src: { type: String, required: true } })
const src = toRef(props, "src")

const { playing } = useMediaControls(videoRef, { src })
const emit = defineEmits(["updated"])

onMounted(() => {
  watch(playing, isPlaying => emit("updated", isPlaying ? videoRef : emptyRef), { immediate: true })
})

onBeforeUnmount(() => {
  emit("updated", emptyRef)
})
</script>

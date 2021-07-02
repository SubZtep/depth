<template lang="pug">
video(
  autoplay="true"
  loop="true"
  muted="true"
  controls="true"
  playsinline="true"
  ref="videoRef"
  poster="no-video.png")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { useMediaControls } from "@vueuse/core"
import { onMounted, onBeforeUnmount, ref, toRefs, watch } from "vue"

const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const emptyRef = ref<HTMLVideoElement>()
const props = defineProps({ src: { type: String, required: true } })
const src = toRefs(props).src

const { playing } = useMediaControls(videoRef, { src })
const emit = defineEmits(["updated"])

onMounted(() => {
  watch(playing, isPlaying => emit("updated", isPlaying ? videoRef : emptyRef), { immediate: true })
})

onBeforeUnmount(() => {
  emit("updated", emptyRef)
})
</script>

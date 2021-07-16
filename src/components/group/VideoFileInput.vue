<template lang="pug">
video(
  ref="videoRef"
  loop="true"
  muted="true"
  autoplay="true"
  controls="false"
  playsinline="true"
  poster="/textures/no-video.png")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { not, set, get, whenever, useMediaControls, useCssVar, useEventListener } from "@vueuse/core"
import { onBeforeUnmount, ref, toRef, watch } from "vue"

const emit = defineEmits(["play", "pause"])
const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const props = defineProps({ src: { type: String, required: true } })
const src = toRef(props, "src")

const { playing } = useMediaControls(videoRef, { src })
watch(playing, isPlaying => emit(isPlaying ? "play" : "pause", isPlaying && videoRef))

whenever(not(src), () => {
  set(playing, false)
  const video = get(videoRef)
  video.pause()
  video.removeAttribute("src")
  video.load()
})

const ratio = useCssVar("--ratio", videoRef)
useEventListener<{ target: HTMLVideoElement }>(videoRef, "resize", ({ target }) => {
  set(ratio, String(target.videoWidth / target.videoHeight))
})

onBeforeUnmount(() => {
  emit("pause")
})
</script>

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
import type { Ref } from "vue"
import { not, set, get, whenever, useMediaControls, useCssVar, useEventListener } from "@vueuse/core"
import { onBeforeUnmount, ref, toRef, watch } from "vue"

const emit = defineEmits(["play", "pause"])
const props = defineProps({ src: { type: String, required: true } })
const src = toRef(props, "src")
const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const { playing } = useMediaControls(videoRef, { src })
const ratio = useCssVar("--ratio", videoRef)

useEventListener<{ target: HTMLVideoElement }>(videoRef, "resize", ({ target }) => {
  set(ratio, String(target.videoWidth / target.videoHeight))
})

watch(playing, isPlaying => {
  if (isPlaying) {
    emit("play", videoRef)
  } else {
    emit("pause")
  }
})

whenever(not(src), () => {
  set(playing, false)
  const video = get(videoRef)
  video.pause()
  video.removeAttribute("src")
  video.load()
})

onBeforeUnmount(() => {
  set(playing, false)
  emit("pause")
})
</script>

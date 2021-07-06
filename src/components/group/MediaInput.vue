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
import { unrefElement, useUserMedia, until } from "@vueuse/core"
import { onBeforeUnmount, ref, watch, toRef } from "vue"

const emit = defineEmits(["play", "pause"])
const props = defineProps({ videoDeviceId: { type: String, required: true } })
const videoDeviceId = toRef(props, "videoDeviceId")
const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const { stream, start, stop } = useUserMedia({ videoDeviceId, audioDeviceId: false, autoSwitch: true, enabled: false })

watch(stream, async v => {
  await until(videoRef).not.toBeUndefined()
  const video = unrefElement(videoRef)
  if (v) {
    video.srcObject = v
    emit("play", videoRef)
  } else {
    video.srcObject = null
    emit("pause")
  }
})

watch(
  videoDeviceId,
  id => id !== "" ? start() : stop(),
  { immediate: true }
)

onBeforeUnmount(() => {
  stop()
  emit("pause")
})
</script>

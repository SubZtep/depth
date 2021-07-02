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
import { unrefElement, useUserMedia } from "@vueuse/core"
import { defineProps, onMounted, onBeforeUnmount, ref, watch, toRefs } from "vue"

const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const props = defineProps({ videoDeviceId: { type: String, required: true } })
const videoDeviceId = toRefs(props).videoDeviceId
const media = useUserMedia({ videoDeviceId, audioDeviceId: false, autoSwitch: true, enabled: true })

onMounted(() => {
  watch(media.stream, stream => {
    unrefElement(videoRef).srcObject = stream || null
  }, { immediate: true })
})

onBeforeUnmount(() => {
  media.stop()
})
</script>

<template lang="pug">
video(
  loop
  muted
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png")
</template>

<script lang="ts" setup>
import { unrefElement, get, until, useUserMedia, invoke } from "@vueuse/core"
import { defineProps, onMounted, onBeforeUnmount, ref, watchEffect } from "vue"
import { useInputGroup } from "../composables/useInputGroup"

const { opts } = defineProps({ opts: { type: Object as PropType<MediaInputGroup>, required: true } })
const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
useInputGroup<MediaInputGroup>(opts, videoRef)

const media = useUserMedia({ videoDeviceId: opts.deviceId, audioDeviceId: false, enabled: false })

onMounted(async () => {
  watchEffect(async () => {
    await media.start()
    invoke(async () => {
      await until(media.stream).not.toBeUndefined()
      unrefElement(videoRef).srcObject = get(media.stream)
    })
  })
})

onBeforeUnmount(() => {
  media.stop()
})
</script>

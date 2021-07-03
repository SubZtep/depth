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
import type { Ref, WatchStopHandle } from "vue"
import { unrefElement, useUserMedia, useEventListener } from "@vueuse/core"
import { onMounted, onBeforeUnmount, ref, watch, toRef } from "vue"

const emit = defineEmits(["updated", "dimensions"])
const props = defineProps({ videoDeviceId: { type: String, required: true } })
const videoDeviceId = toRef(props, "videoDeviceId")

const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const emptyRef = ref<HTMLVideoElement>()

const { stream, stop } = useUserMedia({ videoDeviceId, audioDeviceId: false, autoSwitch: true, enabled: true })

let stopWatch: WatchStopHandle | undefined = undefined

useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
  const { videoWidth, videoHeight } = target
  emit("dimensions", { videoWidth, videoHeight })
})

onMounted(() => {
  stopWatch = watch(
    stream,
    v => {
      const video = unrefElement(videoRef)
      if (v) {
        video.srcObject = v
        emit("updated", videoRef)
      } else {
        video.srcObject = null
        emit("updated", emptyRef)
      }
    },
    {
      immediate: true,
    }
  )
})

onBeforeUnmount(() => {
  stopWatch?.apply(undefined)
  emit("updated", emptyRef)
  stop()
})
</script>

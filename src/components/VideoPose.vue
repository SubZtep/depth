<template lang="pug">
button.bordered(@click="enabled = !enabled") {{ enabled ? "Stop" : "Start" }}
select
  option(
    v-for="camera of cameras"
    :key="camera.deviceId"
    :selected="currentCamera === camera.deviceId"
    @click="currentCamera = camera.deviceId")
    | {{ camera.label }}

.wrapper
  video.w-full.h-full(ref="video" muted autoplay)
  //-SkeletonCanvas.pose(:poses="poses")
</template>

<script lang="ts" setup>
import { ref, watchEffect, watch } from "vue"
import { useUserMedia, useDevicesList } from "@vueuse/core"
import { usePoser } from "../composables/usePoser"

const currentCamera = ref<string>()
const video = ref<HTMLVideoElement>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value)) currentCamera.value = cameras.value[0]?.deviceId
  },
})

const { stream, enabled } = useUserMedia({
  videoDeviceId: currentCamera,
})

const { pause, resume } = usePoser(video)

watch(enabled, isEnabled => {
  if (!isEnabled) pause()
})

watchEffect(() => {
  if (video.value !== undefined && stream.value !== undefined) {
    video.value.srcObject = stream.value

    video.value.addEventListener("loadeddata", () => {
      if (enabled.value) {
        resume()
      }
    })
  }
})
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 640px;
  height: 480px;
  transform: scale(-1, 1);
}

.pose {
  position: absolute;
  top: 0;
  width: inherit;
  height: inherit;
}
</style>

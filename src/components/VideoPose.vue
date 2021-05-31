<template lang="pug">
//- button.bordered(@click="enabled = !enabled") {{ enabled ? "Stop" : "Start" }}
select
  option(
    v-for="camera of cameras"
    :key="camera.deviceId"
    :selected="currentCamera === camera.deviceId"
    @click="currentCamera = camera.deviceId")
    | {{ camera.label }}

//-.wrapper
  video.w-full.h-full(ref="video" muted autoplay)
  //-SkeletonCanvas.pose(:poses="poses")
</template>

<script lang="ts" setup>
import { ref, watchEffect, watch } from "vue"
import { useDevicesList } from "@vueuse/core"
import { usePoser } from "../composables/usePoser"

const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value)) currentCamera.value = cameras.value[0]?.deviceId
  },
})

const { pose } = usePoser()

watchEffect(() => {
  console.log("POSES in component", pose.keypoints)
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

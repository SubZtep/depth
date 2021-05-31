<template lang="pug">
Renderer(antialias resize)
  //- Camera(:position="{ z: 2 }")
  Camera
  Scene(background="red")
    PointLight
      Box(:position="{ y: 0, z: -3 }" :rotation="{x: 90, y: 60, z: 90 }")
        ToonMaterial(color="blue")
        //- LambertMaterial)

//- select
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

<script lang="ts">
import { ref, watchEffect, defineComponent } from "vue"
import { useDevicesList } from "@vueuse/core"
import { usePoser } from "../composables/usePoser"
import { AmbientLight, Box, Camera, ToonMaterial, PointLight, Renderer, Scene } from "troisjs"

// const currentCamera = ref<string>()
// const { videoInputs: cameras } = useDevicesList({
//   requestPermissions: true,
//   onUpdated() {
//     if (!cameras.value.find(i => i.deviceId === currentCamera.value)) currentCamera.value = cameras.value[0]?.deviceId
//   },
// })

export default defineComponent({
  components: {
    AmbientLight,
    Box,
    Camera,
    ToonMaterial,
    PointLight,
    Renderer,
    Scene,
  },
  setup() {
    // const { pose } = usePoser()

    // watchEffect(() => {
    //   console.log("POSES in component", pose.keypoints)
    // })
  },
})
</script>

<style>
/* .wrapper {
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
} */
</style>

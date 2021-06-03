<template lang="pug">
h3 body {{ body.get('left_eye') }}
Renderer(antialias resize)
  //- Camera(:position="{ z: 3 }" :lookAt="body.get('right_eye')")
  Camera(:position="{ x: 50, y: 1, z: 20 }")
  Scene(background="red")
    PointLight
      Box(:position="{ x: 0 }")
        ToonMaterial(color="red")
      Box(:position="{ x: 100 }")
        ToonMaterial(color="red")
      Box(:position="body.get('left_eye')")
        ToonMaterial(color="blue")
      Box(:position="body.get('right_eye')")
        ToonMaterial(color="blue")
</template>

<script lang="ts" setup>
import { usePoser } from "../composables/usePoser"
import { useNProgress } from "@vueuse/integrations"
const { isLoading } = useNProgress()
const { body } = usePoser({
  isLoading,
  interval: 1000,
  filterKeypointNames: [
    // "left_eye_inner",
    "left_eye",
    // "left_eye_outer",
    // "right_eye_inner",
    "right_eye",
    // "right_eye_outer",
  ],
  minScore: 0.6,
  normalize: (kp, width, _height) => {
    kp.x = (kp.x / width) * 100
    // kp.y = (kp.y / height) * 100
    kp.y = 0
    return kp
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

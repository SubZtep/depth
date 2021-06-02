<template lang="pug">
Renderer(antialias resize)
  //- Camera(:position="{ z: 3 }" :lookAt="body.get('right_eye')")
  Camera(:position="{ x: 50, y: 1, z: 20 }")
  Scene(background="red")
    PointLight
      Box(:position="{ x: 0 }")
        ToonMaterial(color="blue")
      Box(:position="{ x: 100 }")
        ToonMaterial(color="blue")
      Box(:position="body.get('right_eye')")
        ToonMaterial(color="blue")
      //-Box(:position="body.get('right_eye')" :rotation="{x: 90, y: 60, z: 90 }")
        ToonMaterial(color="blue")
</template>

<script lang="ts" setup>
import { useBody } from "../composables/useBody"
import { usePoser } from "../composables/usePoser"
const { pose, width, height } = usePoser({
  interval: 1000,
  keypointNames: ["left_eye_inner", "left_eye", "left_eye_outer", "right_eye_inner", "right_eye", "right_eye_outer"],
})
const { body } = useBody(pose, width, height)

// body.value.
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

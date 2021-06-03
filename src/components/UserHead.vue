<template lang="pug">
//- h3 body {{ body.get('left_eye') }}

div.canvas(ref="canvas")
//-Renderer(antialias resize)
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
import { ref } from "vue"
import { useNProgress } from "@vueuse/integrations"
import { usePoser } from "../composables/usePoser"
import { useThree } from "../composables/useThree"
import { useSkeleton } from "../composables/useSkeleton"
import * as THREE from "three"

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

const canvas = ref<HTMLElement | null>(null)
const { scene, invokeRafSync, camera } = useThree(canvas)

useSkeleton({ body, scene, invokeRafSync, camera })

// const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

// invokeRafSync.add(() => {
//   cube.rotation.x += 0.01
//   cube.rotation.y += 0.01
// })
</script>

<style>
.canvas {
  height: 300px;
}
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

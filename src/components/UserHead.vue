<template lang="pug">
h3 body {{ body.left_eye }}

div.canvas(ref="canvas")
</template>

<script lang="ts" setup>
import type { UnwrapRef } from "vue"
import { computed, ref, reactive} from "vue"
// import { useNProgress } from "@vueuse/integrations"
import type { BodyPoints } from "../composables/usePoser"
import { usePoser } from "../composables/usePoser"
import { useThree } from "../composables/useThree"
import { useSkeleton } from "../composables/useSkeleton"

// const { isLoading } = useNProgress()
// const { body } = usePoser({
const body = usePoser({
  interval: 1000,
  residualKeypoints: [
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

// const body = computed<BodyPoints>(() => ({
//   left_eye: { position: [10, 10, 0] },
//   right_eye: { position: [80, 10, 0] },
// }))
// const body: UnwrapRef<BodyPoints> = reactive<BodyPoints>({ left_eye: { position: [10, 10, 0] }, right_eye: { position: [80, 10, 0] } })
// setInterval(() => { body.left_eye!.position[1] += 0.1 }, 100)

//setInterval(() => console.log(body), 800)

useSkeleton({ body, scene, invokeRafSync, camera })

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

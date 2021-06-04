<template lang="pug">
//- h3 body {{ body }}{{whichSkybox}}
input(type="range" min="1" max="15" v-model="skyboxNumber")

div.canvas(ref="canvas")
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from "vue"
import { usePoser } from "../composables/usePoser"
import { useThree } from "../composables/useThree"
import { useSkeleton } from "../composables/useSkeleton"

const normalizer: NormalizerFn = (w, h) => p => [(p.x / w) * 100, (p.y / h) * 0, 0]
const opts: PoserOptions = {
  focusJoints: ["left_eye_inner", "left_eye", "left_eye_outer", "right_eye"],
  interval: 1666,
  minScore: 0.69,
}

const skyboxNumber = ref(3)
const canvas = ref<HTMLElement>()
const { updater } = useThree(canvas, skyboxNumber)
const { body } = usePoser(normalizer, opts)
useSkeleton(body, updater)

// const body = computed<BodyPoints>(() => ({
//   left_eye: { position: [10, 10, 0] },
//   right_eye: { position: [80, 10, 0] },
// }))
// const body: UnwrapRef<BodyPoints> = reactive<BodyPoints>({ left_eye: { position: [10, 10, 0] }, right_eye: { position: [80, 10, 0] } })
// setInterval(() => { body.left_eye!.position[1] += 0.1 }, 100)
</script>

<style>
.canvas {
  height: 300px;
}
</style>

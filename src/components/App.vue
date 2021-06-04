<template lang="pug">
p {{skyboxNumber}}
canvas.canvas(ref="canvas")

Gui(:onThree="skyboxNumber")

</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { usePoser } from "../composables/usePoser"
import { useThree } from "../composables/useThree"
import { useSkeleton } from "../composables/useSkeleton"
import { unrefElement } from "@vueuse/core"

function onThree() {
  //
}

const opts: PoserOptions = {
  focusJoints: ["left_eye_inner", "left_eye", "left_eye_outer", "right_eye"],
  interval: 1666,
  minScore: 0.69,
}

const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  const { updater } = useThree(unrefElement(canvas))
})

const skyboxNumber = ref(5)

//const { updater } = useThree(canvas)

// const { body } = usePoser(normalizer, opts)
// useSkeleton(body, updater)
</script>

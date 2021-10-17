<template lang="pug">
Title.flex-col(v-if="bored" class="!duration-13000")
  | {{bored.activity}}
  .text-2xl.text-cyan-600.opacity-50.tracking-wider
    | {{bored.type}}

ThreeGlobe
</template>

<script lang="ts" setup>
import { singleFns } from "~/packages/ThreeJS/useRenderLoop"
import { useCameraMoves, useBoredApi } from "~/composables"
import { rand } from "~/misc/utils"
const visibility = useDocumentVisibility()

const { moves, count } = useCameraMoves()
const { bored, query } = useBoredApi()

const { pause, resume } = useIntervalFn(
  async () => {
    await query()
    singleFns.add(({ cameraControls }) => moves(cameraControls)(rand(count)))
  },
  6969,
  { immediateCallback: true }
)

watch(visibility, current => {
  // FIXME: test more also run `useDocumentVisibility` only once
  if (current === "visible") {
    resume()
  } else if (current === "hidden") {
    pause()
  }
})
</script>

<template lang="pug">
Title.flex-col(v-if="bored" class="!duration-13000")
  | {{bored.activity}}
  .text-2xl.text-cyan-600.opacity-50.tracking-wider
    | {{bored.type}}
</template>

<script lang="ts" setup>
import { useCameraMoves, singleFns } from "@depth/three.js"
import { useBoredApi } from "../composables"
import { onVisibility } from "../events"
import { rand } from "../misc/utils"

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

onVisibility(({ visible }) => {
  visible ? resume() : pause()
})

onBeforeUnmount(() => {
  pause()
})
</script>

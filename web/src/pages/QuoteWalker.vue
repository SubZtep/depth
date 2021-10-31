<template lang="pug">
Title(v-if="bored" class="!duration-13000 flex-col")
  | {{bored.activity}}
  .text-2xl.text-cyan-600.opacity-50.tracking-wider
    | {{bored.type}}
</template>

<script lang="ts" setup>
import { exec3D } from "@depth/three.js"
import { useBoredApi } from "../composables"
import { onVisibility } from "../events"
import { rand } from "@depth/misc"

const { moves, count } = useCameraMoves()
const { bored, query } = useBoredApi()

const { pause, resume } = useIntervalFn(
  async () => {
    await query()
    exec3D(({ cameraControls }) => moves(cameraControls)(rand(count)))
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

<script lang="ts">
import { MathUtils } from "three"

function useCameraMoves() {
  const moves = (cameraControls: any/*CameraControls*/) => (idx: number) => {
    switch (idx) {
      case 1:
        cameraControls.rotate(45 * MathUtils.DEG2RAD, 0, true)
        break
      case 2:
        cameraControls.rotate(-90 * MathUtils.DEG2RAD, 0, true)
        break
      case 3:
        cameraControls.rotate(0, 20 * MathUtils.DEG2RAD, true)
        break
      case 4:
        cameraControls.truck(6, 0, true)
        break
      case 5:
        cameraControls.truck(0, 9, true)
        break
      case 6:
        cameraControls.truck(-6, -9, true)
        break
      case 7:
        cameraControls.dolly(6, true)
        break
      case 8:
        cameraControls.dolly(-9, true)
        break
    }
  }

  const count = 8

  return {
    moves,
    count,
  }
}
</script>

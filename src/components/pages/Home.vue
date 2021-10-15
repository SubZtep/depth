<template lang="pug">
Title(
  v-if="title"
  class="!duration-13000")
  | {{title}}
</template>

<script lang="ts" setup>
import type CameraControls from "camera-controls"
import { singleFns } from "~/packages/ThreeJS/useRenderLoop"
import { MathUtils } from "three"
import { rand } from "~/misc/utils"

const moves = (cameraControls: CameraControls) => (idx: number) => {
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

const title = ref("")

useIntervalFn(async () => {
  set(title, "")

  singleFns.add(({ cameraControls }) => {
    moves(cameraControls)(rand(8))
  })

  const { data, isFinished } = useFetch("http://numbersapi.com/random", { mode: "cors" }).get().text()
  await until(isFinished).toBe(true)
  set(title, get(data))
}, 6969, { immediateCallback: true })
</script>

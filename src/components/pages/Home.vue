<template lang="pug">
Title(v-if="title") {{title}}
</template>

<script lang="ts" setup>
import type CameraControls from "camera-controls"
import { MathUtils } from "three"
import { rand } from "~/misc/utils"
import { singleFns } from "~/packages/ThreeJS/useRenderLoop"

const moves = (cameraControls: CameraControls) => [
  () => cameraControls.rotate(45 * MathUtils.DEG2RAD, 0, true),
  () => cameraControls.rotate(-90 * MathUtils.DEG2RAD, 0, true),
  () => cameraControls.rotate(0, 20 * MathUtils.DEG2RAD, true),
  () => cameraControls.truck(6, 0, true),
  () => cameraControls.truck(0, 9, true),
  () => cameraControls.truck(-6, -9, true),
  () => cameraControls.dolly(6, true),
  () => cameraControls.dolly(-9, true),
]

const title = ref("")
const duration = useCssVar("--title-duration")

onMounted(() => {
  set(duration, "13s")
})

onBeforeUnmount(() => {
  set(duration, "4s")
})

setInterval(
  async () => {
    set(title, "")

    singleFns.add(({ cameraControls }) => {
      const mv = moves(cameraControls)
      mv[rand(mv.length) - 1]()
    })

    const { data, isFinished } = useFetch("http://numbersapi.com/random").get().text()
    await until(isFinished).toBe(true)
    set(title, get(data))

  },
  6969,
  { immediate: false }
)
</script>

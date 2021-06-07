<template lang="pug">
canvas(ref="canvasRef")
video(ref="videoRef" playsinline muted autoplay :class="{ visible: guiParams.preview }")
.gui {{ guiParams }} {{ body }}
</template>

<script lang="ts" setup>
import type { Fn } from "@vueuse/core"
import { ref, toRef, onMounted, reactive } from "vue"
import { unrefElement, useRafFn } from "@vueuse/core"
import { useThree } from "./composables/useThree"
import { usePoser } from "./composables/usePoser"
import { usePoseNormalizer } from "./composables/usePoseNormalizer"
import { useTweakGui } from "./composables/useTweakGui"
import { useCam } from "./composables/useCam"

const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

const { onThree, skybox } = useThree(canvasRef)

const guiParams = reactive({
  webcam: false,
  preview: true,
  skybox,
})

const { onStream } = useCam(videoRef, toRef(guiParams, "webcam"))
const { initPoser, state, execute } = usePoser()
const { setStreamDimensions, body } = usePoseNormalizer(state)

useTweakGui(guiParams, {
  execute,
})

onStream(setStreamDimensions)

const updateer =
  ({ clock, cameraControls, renderer, scene, camera }: ThreeProps) =>
  () => {
    const delta = clock.getDelta()
    cameraControls.update(delta)
    renderer.render(scene, camera)
  }

let update: Fn

const { resume } = useRafFn(() => update(), { immediate: false })

onThree(props => {
  update = updateer(props)
  resume()
})

onMounted(async () => {
  const video: HTMLVideoElement = unrefElement(videoRef)
  console.time("poser")
  await initPoser(video)
  console.timeEnd("poser")
})
</script>

<template lang="pug">
canvas(ref="canvasRef")
video(ref="videoRef" playsinline muted autoplay :class="{ visible: guiParams.preview }")
.gui {{ body }}
</template>

<script lang="ts" setup>
import type { Fn } from "@vueuse/core"
import { ref, toRef, reactive, watch } from "vue"
import { unrefElement, invoke, until, useRafFn, whenever, get, set, not } from "@vueuse/core"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { usePoseNormalizer } from "./composables/usePoseNormalizer"
import { useTweakGui } from "./composables/useTweakGui"
import { useThree } from "./composables/useThree"
import { usePoser } from "./composables/usePoser"
import { useCam } from "./composables/useCam"
import { warn } from "vue-chemistry/console"

const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

const { isLoading } = useNProgress()
const { onThree } = useThree(canvasRef)

const guiParams = reactive<GuiParams>({
  webcam: false,
  preview: false,
  isActive: false,
  timePerFrame: 0,
  loadPoser: false,
  startPoser: false,
})

const { onStream } = useCam(videoRef, toRef(guiParams, "webcam"))
const { initPoser, state, execute, isReady } = usePoser()
const { setStreamDimensions, body } = usePoseNormalizer(state)

onStream(setStreamDimensions)

const updateer =
  ({ clock, cameraControls, renderer, scene, camera }: ThreeProps) =>
  () => {
    const now = Date.now()
    const delta = clock.getDelta()
    cameraControls.update(delta)

    if (get(isReady)) {
      execute()
    }

    renderer.render(scene, camera)
    guiParams.timePerFrame = Date.now() - now
  }

let update: Fn

const { pause, resume } = useRafFn(() => update(), { immediate: false })
const { pane } = useTweakGui(guiParams, body)

onThree(async props => {
  update = updateer(props)
  guiParams.isActive = true
  pane.refresh()
})

watch(
  () => guiParams.isActive,
  run => (run ? resume() : pause())
)

invoke(async () => {
  await until(() => guiParams.loadPoser).toBeTruthy()

  set(isLoading, true)
  console.time("poser")
  const video: HTMLVideoElement = unrefElement(videoRef)
  await initPoser(video)
  console.timeEnd("poser")
  set(isLoading, false)
  guiParams.loadPoser = false
})

let firstPosed = false
whenever(
  () => guiParams.startPoser,
  async () => {
    if (firstPosed && not(isReady)) {
      warn("poser not ready", isReady)
      guiParams.startPoser = false
      firstPosed = false // FIXME: test isReady and readyState
      return
    }

    set(isLoading, true)
    console.time("execute")
    await execute()
    console.timeEnd("execute")
    set(isLoading, false)
    firstPosed = true
    guiParams.startPoser = false
  }
)
</script>

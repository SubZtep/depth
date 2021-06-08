<template lang="pug">
canvas(ref="canvasRef")
video(ref="videoRef" playsinline muted autoplay :class="{ visible: togglers.videoPreview }")
.gui
  pre xx {{ togglers }} {{ body }}
</template>

<script lang="ts" setup>
import type { Fn } from "@vueuse/core"
import { ref, reactive, onMounted } from "vue"
import { useRafFn, get, unrefElement, invoke, until } from "@vueuse/core"
import { usePoseNormalizer } from "./composables/usePoseNormalizer"
import { useMediaPipePose } from "./composables/useMediaPipePose"
import { useSkeleton } from "./composables/useSkeleton"
import { useThreeJs } from "./composables/useThreeJs"
import { useDatGui } from "./composables/useDatGui"
import { useWebCam } from "./composables/useWebCam"
import { useIdle } from '@vueuse/core'

const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

const { onRenderable } = useThreeJs(canvasRef)

const togglers: ComponentTogglers = reactive({
  videoDeviceId: "",
  webcam: false,
  videoPreview: false,
})

const { onVideoStream } = useWebCam(videoRef, togglers)
const { initPoseDetector, poses, isDetectorReady, estimatePoses } = useMediaPipePose(videoRef)
const { setStreamDimensions, body } = usePoseNormalizer(poses, { focusJoints: ["nose"], minScore: 0.1 })
const { idle } = useIdle()
useDatGui(togglers)

const { sceneToSkeleton, parts } = useSkeleton(body)
onVideoStream(setStreamDimensions)

const initUpdater =
  ({ clock, cameraControls, renderer, scene, camera }: ThreeJsObjects) =>
  () => {
    const delta = clock.getDelta()
    cameraControls.update(delta)
    get(isDetectorReady) && estimatePoses()



    renderer.render(scene, camera)
  }

let update: Fn
const { resume } = useRafFn(() => update(), { immediate: false })


onRenderable(async objs => {
  update = initUpdater(objs)
  sceneToSkeleton(objs.scene)
  await initPoseDetector()
  resume()
})

onMounted(() => {
  const video: HTMLVideoElement = unrefElement(videoRef)
  video.addEventListener("canplay", async () => await estimatePoses())

  invoke(async () => {
    await until(idle).toBeTruthy()
    if (get(poses).length === 0) {
      togglers.webcam = true
      // FIXME: should stop idle watch? (how?)
    }
  })
})
</script>

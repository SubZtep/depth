<template lang="pug">
canvas(ref="canvasRef")
video(ref="videoRef" playsinline muted autoplay :class="{ visible: togglers.videoPreview }")
.gui
  pre xx {{ togglers }} {{ body }}
</template>

<script lang="ts" setup>
import type { Fn } from "@vueuse/core"
import { ref, reactive, onMounted } from "vue"
import { useRafFn, get, unrefElement } from "@vueuse/core"
import { usePoseNormalizer } from "./composables/usePoseNormalizer"
import { useMediaPipePose } from "./composables/useMediaPipePose"
import { useThreeJs } from "./composables/useThreeJs"
import { useDatGui } from "./composables/useDatGui"
import { useWebCam } from "./composables/useWebCam"

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
const { setStreamDimensions, body } = usePoseNormalizer(poses)
onVideoStream(setStreamDimensions)

const initUpdater =
  ({ clock, cameraControls, renderer, scene, camera }: ThreeJsObjects) =>
  () => {
    const delta = clock.getDelta()
    cameraControls.update(delta)

    if (get(isDetectorReady)) {
      estimatePoses()
    }

    renderer.render(scene, camera)
  }

let update: Fn

const { resume } = useRafFn(() => update(), { immediate: false })

useDatGui(togglers)

onRenderable(async objs => {
  update = initUpdater(objs)
  await initPoseDetector()
  resume()
})

onMounted(() => {
  const video: HTMLVideoElement = unrefElement(videoRef)
  video.addEventListener("canplay", async () => {
    await estimatePoses()
  })
})
</script>

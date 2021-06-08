<template lang="pug">
canvas(ref="canvasRef")
video(ref="videoRef" playsinline muted autoplay :class="{ visible: togglers.videoPreview }")
.gui
  pre xx {{ togglers }} {{ poseNormalizer(poses) }}
</template>

<script lang="ts" setup>
import type { Fn } from "@vueuse/core"
import { ref, reactive, onMounted, watch } from "vue"
import { useRafFn, get, unrefElement, invoke, until } from "@vueuse/core"
import { useMediaPipePose } from "./composables/useMediaPipePose"
// import { useSkeleton } from "./composables/useSkeleton"
import { useThreeJs } from "./composables/useThreeJs"
import { useDatGui } from "./composables/useDatGui"
import { useWebCam } from "./composables/useWebCam"
import { stickman, jointsToScene } from "./models/stickman"
import { setStreamDimensions, poseNormalizer } from "./misc/pose-normalizer"

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
useDatGui(togglers)

// const { sceneToSkeleton, parts } = useSkeleton(body)

onVideoStream(setStreamDimensions)

watch(poses, newPoses => {
  stickman(poseNormalizer(newPoses))
  console.log("Stickman updated")
})

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
  // sceneToSkeleton(objs.scene)
  objs.scene.add(...jointsToScene())
  await initPoseDetector()
  resume()
})

onMounted(() => {
  const video: HTMLVideoElement = unrefElement(videoRef)
  video.addEventListener("canplay", async () => await estimatePoses())
})
</script>

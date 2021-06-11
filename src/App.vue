<template lang="pug">
.loading(v-show="loading") Loading...
canvas(ref="canvasRef")
video(
  show
  muted
  autoplay
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png"
  :class="{ visible: togglers.videoPreview }")
  source(src="mask.webm" type="video/webm")

//- .gui
  pre poses {{ poses[0]?.keypoints.map(v => [v.name, v.score]) }}
  //- pre xxs {{ togglers }} {{ poseNormalizer(poses) }}
</template>

<script lang="ts" setup>
import type { Fn } from "@vueuse/core"
import { ref, onMounted, watch, reactive } from "vue"
import { useRafFn, get, set, unrefElement } from "@vueuse/core"
import { useMediaPipePose } from "./composables/useMediaPipePose"
import { useThreeJs } from "./composables/useThreeJs"
import { useDatGui } from "./composables/useDatGui"
import { useWebCam } from "./composables/useWebCam"
import { add33JointsToScene, initJointUpdater } from "./models/stickman"
import { setStreamDimensions, poseNormalizer } from "./misc/pose-normalizer"
import { videoMesh } from "./models/skybox"
import CameraControls from "camera-controls"
import * as THREE from "three"

const loading = ref(false)
const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

const { initThree, onThreeReady } = useThreeJs(canvasRef)
const { togglers, videoGui } = useDatGui()
const { onVideoStream: onWebCamVideoStream } = useWebCam(videoRef, togglers)
const { initPoseDetector, poses, isDetectorReady, estimatePoses } = useMediaPipePose(videoRef)

const scale = 0.01

interface PlayerMesh {
  mesh: THREE.Mesh
  width: number
  height: number
}

let videoPlayerMesh: PlayerMesh | undefined
let updateJoints: UpdateJointsFn

let setMesh: (video: HTMLVideoElement) => void
function initSetMesh(scene: THREE.Scene, cameraControls: CameraControls) {
  return (videoEl: HTMLVideoElement) => {
    if (videoPlayerMesh?.mesh?.isObject3D) {
      scene.remove(videoPlayerMesh.mesh)
      videoPlayerMesh.mesh.remove()
    }

    videoPlayerMesh = videoMesh(videoEl, scale)

    updateJoints = initJointUpdater(videoPlayerMesh.width, videoPlayerMesh.height)

    cameraControls.fitToBox(videoPlayerMesh.mesh, false, {
      paddingLeft: 1,
      paddingRight: 1,
      paddingBottom: 1,
      paddingTop: 1,
    })
    scene.add(videoPlayerMesh.mesh)

    console.log([videoEl.isPlaying, videoRef.value?.videoWidth])
    if (!videoEl?.isPlaying) {
      videoEl?.play()
    }
  }
}

onWebCamVideoStream(async ([_stream, settings]) => {
  if (settings === undefined) return
  setStreamDimensions(settings)
})

watch(poses, newPoses => {
  const distortion: VideoPlayerDistortion = {
    scale,
    flipY: true,
    transparent: true,
  }
  updateJoints(newPoses, distortion)
})

const initTickLoop =
  ({ clock, cameraControls, renderer, scene, camera }: ThreeJsObjects) =>
  () => {
    const delta = clock.getDelta()
    cameraControls.update(delta)
    videoRef.value!.isPlaying && get(isDetectorReady) && estimatePoses()
    renderer.render(scene, camera)
  }

let tickLoop: Fn
const { resume } = useRafFn(() => tickLoop(), { immediate: false })

onThreeReady(async three => {
  console.log("THREE Ready")
  const { scene, cameraControls } = three

  add33JointsToScene(scene)
  setMesh = initSetMesh(scene, cameraControls)
  cameraControls.setPosition(0, 2, 5)

  tickLoop = initTickLoop(three)
})

onMounted(async () => {
  const video: HTMLVideoElement = get(videoRef)!

  video.addEventListener(
    "play",
    async () => {
      console.log("PLAY")
      set(loading, true)
      setMesh(video)
      await initPoseDetector()
      await estimatePoses()
      get(canvasRef)!.classList.remove("hidden")
      set(loading, false)
      resume()
    }
    // { once: true }
  )

  initThree(canvasRef.value!)
  // await initPoseDetector()
})
</script>

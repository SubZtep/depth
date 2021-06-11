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
import type { FitToOptions } from "camera-controls/dist/types"
import { useRafFn, get, set } from "@vueuse/core"
import CameraControls from "camera-controls"
import { ref, onMounted, watch } from "vue"
import * as THREE from "three"
import { videoMesh } from "./models/skybox"
import { useThreeJs } from "./composables/useThreeJs"
import { useDatGui } from "./composables/useDatGui"
import { useMediaPipePose } from "./composables/useMediaPipePose"
import { add33JointsToScene, initJointUpdater } from "./models/stickman"
import { useWebCam } from "./composables/useWebCam"

const loading = ref(false)
const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

const { togglers } = useDatGui()
const { initThree, onThreeReady } = useThreeJs()
const { initPoseDetector, poses, isDetectorReady, estimatePoses } = useMediaPipePose(videoRef)
useWebCam(videoRef, togglers)

let scale = 1
const videoToCamera: Partial<FitToOptions> = { paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: 1 }

let tickLoop: Fn
let setMesh: SetMeshFn
let updateJoints: UpdateJointsFn

function initSetMesh(scene: THREE.Scene, cameraControls: CameraControls) {
  return (videoEl: HTMLVideoElement) => {
    let vp = scene.getObjectByName("video-player") as VideoPlayerMesh
    let transition = false
    if (vp) {
      vp.material.map!.needsUpdate = true
      transition = true
    } else {
      vp = videoMesh(videoEl)
      scene.add(vp)
    }

    const { videoWidth, videoHeight } = videoEl
    const ratio = videoWidth / videoHeight

    const width = 4
    const height = width / ratio
    scale = width / videoWidth
    // console.log({ videoWidth, videoHeight, width, height, ratio, scale })

    vp.scale.setX(width)
    vp.scale.setY(height)
    vp.position.setY(height / 2)

    updateJoints = initJointUpdater(width, height)
    cameraControls.fitToBox(vp, transition, videoToCamera)
  }
}

function initTickLoop({ clock, cameraControls, renderer, scene, camera }: ThreeJsObjects) {
  return () => {
    const delta = clock.getDelta()
    cameraControls.update(delta)
    videoRef.value!.isPlaying && get(isDetectorReady) && estimatePoses()
    renderer.render(scene, camera)
  }
}

onThreeReady(three => {
  add33JointsToScene(three.scene)
  setMesh = initSetMesh(three.scene, three.cameraControls)
  tickLoop = initTickLoop(three)
})

watch(poses, newPoses => {
  updateJoints(newPoses, { scale, flipY: true, transparent: true })
})

const { resume } = useRafFn(() => tickLoop(), { immediate: false })

onMounted(() => {
  const video = get(videoRef)!

  video.addEventListener("canplay", async () => {
    set(loading, true)
    await setMesh(video)
    await initPoseDetector()
    await estimatePoses()
    get(canvasRef)!.classList.remove("hidden")
    set(loading, false)
    resume()
  })

  initThree(canvasRef.value!)
})
</script>

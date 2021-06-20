<template lang="pug">
video(
  loop
  muted
  autoplay
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png"
  :class="{ visible: guiOpts.showEl }")
</template>

<script lang="ts" setup>
import type { Pose } from "@tensorflow-models/pose-detection"
import * as THREE from "three"
import { unrefElement, useEventListener, get, until } from "@vueuse/core"
import { defineProps, defineEmit, onMounted, onBeforeUnmount, ref, toRaw, watch } from "vue"
import { useScenePlayer } from "../composables/useScenePlayer"
import { useWebCam } from "../composables/useWebCam"
import { useDatGui } from "../composables/useDatGui"
import { useThreeJs } from "../composables/useThreeJs"
import { usePose } from "../composables/usePose"
import { rescaler } from "../misc/utils"
import { Stickman } from "../models/stickman"

const emit = defineEmit(["addFn", "delFn"])
const { pid } = defineProps({ pid: { type: String, required: true } })
const { stream, stopWebcam, startWebcam, webcamEnabled } = useWebCam()
const { estimatePoses, detectorReady } = usePose()
const { scene } = useThreeJs()
const root = new THREE.Group()
const stickman = new Stickman(pid, root)
const guiOpts = useDatGui().addPile(pid)
const videoRef = ref<HTMLVideoElement>()
useScenePlayer(videoRef, root, guiOpts)
let rescale: RescaleFn | undefined = undefined


const tick = async () => {
  let pose: Pose
  try {
    pose = await estimatePoses(unrefElement(videoRef))
  } catch (e) {
    // throw new Error(`#${pid} tick: ${e.message}`)
    console.error(`#${pid} tick: ${e.message}`)
    return
  }
  stickman.updateJoints(pose.keypoints)
  stickman.updateLines(pose.keypoints)
}

useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
  const { videoWidth, videoHeight } = target
  rescale = rescaler(videoWidth, videoHeight)
  stickman.videoWidth = videoWidth
  stickman.videoHeight = videoHeight
  stickman.scale = rescale(1).scale
})

watch(stream, s => {
  const video = get(videoRef)
  if (video === undefined) return
  video.srcObject = s ?? null
})

const handleGuiUpdate = () => {
  const video: HTMLVideoElement = unrefElement(videoRef)
  const opts: PileOpts = toRaw(guiOpts)

  if (root.position.x !== opts.position.x || root.position.y !== opts.position.y || root.position.z !== opts.position.z) {
    root.position.set(opts.position.x, opts.position.y, opts.position.z)
  }

  if (rescale !== undefined) {
    stickman.scale = rescale(opts.width).scale
  }

  if (opts.input.webcam && !get(webcamEnabled)) {
    startWebcam()
  }

  if (!opts.input.webcam && get(webcamEnabled)) {
    stopWebcam()
  }

  if (video.src !== opts.input.videoSrc) {
    video.src = opts.input.videoSrc
  }
}

watch(guiOpts, handleGuiUpdate)

onMounted(async () => {
  await until(detectorReady).toBeTruthy()
  scene.add(root)
  handleGuiUpdate()
  emit("addFn", tick)
})

onBeforeUnmount(() => {
  emit("delFn", tick)
  stopWebcam()
  scene.remove(root)
  // TODO: clean up all children
})
</script>

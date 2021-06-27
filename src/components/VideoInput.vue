<template lang="pug">
video(
  loop
  muted
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png"
  :class="{ visible: opts.showEl }")
  source(:src="opts.src" type="video/webm")
</template>

<script lang="ts" setup>
import * as THREE from "three"
import type { PropType } from "vue"
import type { Pose } from "@tensorflow-models/pose-detection"
import { unrefElement, useEventListener, get, set, until, useUserMedia, invoke } from "@vueuse/core"
import { defineProps, defineEmit, onMounted, onBeforeUnmount, ref, toRef, watchEffect } from "vue"
import { useScenePlayer } from "../composables/useScenePlayer"
import { scene, renderer } from "../composables/useThreeJs"
import { usePose } from "../composables/usePose"
import { Stickman } from "../models/stickman"
import { div } from "../misc/utils"

const emit = defineEmit(["addFn", "delFn"])
const { opts } = defineProps({ opts: { type: Object as PropType<InputGroup>, required: true } })
const { estimatePoses, detectorReady } = usePose()
const videoWidth = ref(640)
const videoHeight = ref(480)
const width = toRef(opts, "width")
const scale = div(width, videoWidth)
const ratio = div(videoWidth, videoHeight)
const videoRef = ref<HTMLVideoElement>()
const root = new THREE.Group()
useScenePlayer(videoRef, root, opts, ratio)
let stickman: Stickman

const tick: PrFn = async () => {
  let pose: Pose
  try {
    pose = await estimatePoses(unrefElement(videoRef))
  } catch (e) {
    console.error(`tick: ${e.message}`)
    return
  }
  stickman.updateJoints(pose.keypoints)
  stickman.updateLines(pose.keypoints)
}

useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
  set(videoWidth, target.videoWidth)
  set(videoHeight, target.videoWidth)
})

onMounted(async () => {
  await until(detectorReady).toBeTruthy()
  opts.f.open()
  const video: HTMLVideoElement = unrefElement(videoRef)
  video.play()

  stickman = new Stickman(root, videoWidth, videoHeight, scale)
  stickman.zMulti = toRef(opts, "zMulti")
  scene.add(root)

  watchEffect(async () => {
    root.position.set(opts.position.x, opts.position.y, opts.position.z)
  })

  emit("addFn", tick)
})

onBeforeUnmount(() => {
  emit("delFn", tick)
  // media.stop()
  scene.remove(root)
  stickman.dispose()
  renderer?.renderLists.dispose()
  // TODO: clean up all children
})
</script>

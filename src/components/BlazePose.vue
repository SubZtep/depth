<template>
</template>

<script lang="ts" setup>
import type { BlazePoseMediaPipeModelConfig } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
// import { useNProgress } from "@vueuse/integrations/useNProgress"
import { onMounted, inject, defineProps, onBeforeUnmount } from "vue"
import { tickFns } from "../composables/useThreeJs"
import { set } from "@vueuse/core"

const playerState = inject<PlayerState>("playerState")!
const threeCtrlHook = inject<EventHook<ThreeCtrlEvent>>("threeCtrlHook")!

const { pose } = defineProps({
  pose: { type: Object as PropType<Pose>, required: true }
})

// const { progress, done } = useNProgress()
// set(progress, 0.5)
let detector: PoseDetector

const estimatePose = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (detector === undefined) {
      return reject(new Error("no detector"))
    }

    if (playerState.videoRef.readyState !== playerState.videoRef.HAVE_ENOUGH_DATA) {
      return reject(new Error("no video input"))
    }

    if (!playerState.playing) {
      return reject("video isn't playing")
    }

    const poses = await detector.estimatePoses(playerState.videoRef, {
      flipHorizontal: false,
      maxPoses: 1,
    })

    if (poses === undefined) {
      return reject("poses are undefined")
    }

    if (poses.length > 0) {
      Object.assign(pose, poses[0])
      return resolve()
    } else {
      reject(new Error("no pose detected"))
    }
  })
}

onMounted(async () => {
  detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
    solutionPath: "../node_modules/@mediapipe/pose",
    runtime: "mediapipe",
    modelType: "lite",
  } as BlazePoseMediaPipeModelConfig)
  tickFns.add(estimatePose)
  threeCtrlHook.trigger({ cmd: "resume" })
  // done()
})

onBeforeUnmount(() => {
  tickFns.delete(estimatePose)
  detector.dispose()
})
</script>

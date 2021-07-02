<template>
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { Pose, PoseDetector, BlazePoseMediaPipeModelConfig } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { onMounted, onBeforeUnmount, toRef, watch } from "vue"
import { tickFns } from "../../composables/useThreeJs"
import { get } from "@vueuse/core"

const props = defineProps({
  el: { type: Object as PropType<HTMLVideoElement | undefined>, required: false },
  pose: { type: Object as PropType<Pose>, required: true },
})

const el = toRef(props, "el")
const pose = props.pose

let detector: PoseDetector

const estimatePose = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (detector === undefined) {
      return reject(new Error("no detector"))
    }

    const elem = get(el)

    if (elem === undefined) {
      return reject(new Error("no video input"))
    }

    if (elem.readyState !== elem.HAVE_ENOUGH_DATA) {
      return reject(new Error("not enough data"))
    }

    const poses = await detector.estimatePoses(elem, {
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

  watch(el, elem => {
    if (elem === undefined) {
      tickFns.delete(estimatePose)
    } else {
      tickFns.add(estimatePose)
    }
  }, { immediate: true })
})

onBeforeUnmount(() => {
  tickFns.delete(estimatePose)
  detector.dispose()
})
</script>

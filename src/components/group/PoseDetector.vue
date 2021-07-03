<template></template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { Pose, PoseDetector, BlazePoseMediaPipeModelConfig } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { onMounted, onBeforeUnmount, toRef, watch, onErrorCaptured } from "vue"
import { tickFns } from "../../composables/useThreeJs"
import { get } from "@vueuse/core"
import { useToast } from "vue-toastification"

const props = defineProps({
  el: { type: Object as PropType<HTMLVideoElement | undefined>, required: false },
  pose: { type: Object as PropType<Pose>, required: true },
  immediate: { type: Boolean, default: false },
})

const el = toRef(props, "el")
const { pose, immediate } = props

let detector: PoseDetector

async function createDetector() {
  return await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
    solutionPath: "../node_modules/@mediapipe/pose",
    runtime: "mediapipe",
    modelType: "lite",
  } as BlazePoseMediaPipeModelConfig)
}

const estimatePose = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const elem = get(el)

    if (elem === undefined) {
      return reject(new Error("no video input"))
    }

    if (elem.readyState !== elem.HAVE_ENOUGH_DATA) {
      return reject(new Error("not enough data"))
    }

    if (detector === undefined) {
      return reject(new Error("no pose detector"))
    }

    const poses = await detector.estimatePoses(elem, {
      flipHorizontal: false,
      maxPoses: 1,
    })

    if (poses === undefined) {
      return reject(new Error("poses are undefined"))
    }

    if (poses.length > 0) {
      Object.assign(pose, poses[0])
      return resolve()
    } else {
      reject(new Error("no pose detected"))
    }
  })
}

watch(
  el,
  async elem => {
    if (elem === undefined) {
      tickFns.delete(estimatePose)
    } else {
      if (!immediate && !detector) {
        detector = await createDetector()
      }
      tickFns.add(estimatePose)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (immediate) {
    detector = await createDetector()
  }
})

onBeforeUnmount(() => {
  tickFns.delete(estimatePose)
  detector.dispose()
})


const toast = useToast()
onErrorCaptured(e => {
  console.log("EEE", e.message)
  toast.error(e.message)
  return false
})
</script>

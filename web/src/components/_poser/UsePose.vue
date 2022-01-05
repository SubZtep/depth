<template lang="pug">
ParaPanel(title="Pose Detection")
  div Normalized
  InputBoolean(v-model="state.normalized")

  div Throttle (ms)
  InputNumber(v-model="state.throttle" :min="0" :max="1000" :step="1")

  div Selfie Mode
  InputBoolean(v-model="options.selfieMode")

  div Complexity
  InputNumber(v-model="options.modelComplexity" :min="0" :max="2")

  div Smooth Landmarks
  InputBoolean(v-model="options.smoothLandmarks")

  //- div Enable segmentation
  //- InputBoolean(v-model="options.enableSegmentation")

  //- div Smooth segmentation
  //- InputBoolean(v-model="options.smoothSegmentation")

  div Min detection confidence
  InputNumber(v-model="options.minDetectionConfidence" :min="0" :max="1" :step="0.01")

  div Min tracking confidence
  InputNumber(v-model="options.minTrackingConfidence" :min="0" :max="1" :step="0.01")

slot(:keypoints="keypoints" :normalized="state.normalized")
</template>

<script lang="ts" setup>
import { usePose } from "@depth/poser"

const props = defineProps<{
  video: HTMLVideoElement
  streaming: boolean
}>()

const { video, streaming } = toRefs(props)

const state = reactive({
  normalized: true,
  throttle: 0,
})

const throttle = toRef(state, "throttle")

const keypoints = ref([] as { x: number; y: number; z: number }[])

const options = reactive({
  selfieMode: true,
  modelComplexity: 2 as 0 | 1 | 2,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
})

usePose({
  streaming,
  video,
  options,
  throttle,
  handler: result => {
    if (!result) return
    const landmarks = state.normalized ? result.poseLandmarks : result.poseWorldLandmarks
    if (!landmarks || landmarks.length === 0) return
    set(keypoints, landmarks)
  },
})
</script>

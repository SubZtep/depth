<template lang="pug">
ParaPanel(title="Face Detection")
  //- div Camera near
  //- InputNumber(v-model="options.cameraNear")

  //- div Camera far
  //- InputNumber(v-model="options.cameraFar")

  //- div Camera vertical fov degrees
  //- InputNumber(v-model="options.cameraVerticalFovDegrees")

  //- div Enable face geometry
  //- InputBoolean(v-model="options.enableFaceGeometry")

  //- div Selfie Mode
  //- InputBoolean(v-model="options.selfieMode")

  //- div Max num faces
  //- InputNumber(v-model="options.maxNumFaces" :min="1" :max="4")

  //- div Refine landmarks
  //- InputBoolean(v-model="options.refineLandmarks")

  div Min detection confidence
  InputNumber(v-model="options.minDetectionConfidence" :min="0" :max="1" :step="0.01")

  div Min tracking confidence
  InputNumber(v-model="options.minTrackingConfidence" :min="0" :max="1" :step="0.01")

slot(:keypoints="keypoints")
</template>

<script lang="ts" setup>
import { useFace } from "@depth/poser"
import FaceKeypoints from "~/3d/face.json"

const props = defineProps<{
  video: HTMLVideoElement
  streaming: boolean
  selfie?: boolean
}>()

const keypoints = ref(FaceKeypoints)

const options = reactive({
  // cameraNear: 0,
  // cameraFar: 1,
  // cameraVerticalFovDegrees: 0,
  // enableFaceGeometry: false,
  selfieMode: !!props.selfie,
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
})

useFace({
  streaming: toRef(props, "streaming"),
  video: toRef(props, "video"),
  options,
  handler: result => {
    if (!result || result.multiFaceLandmarks.length === 0) return

    set(keypoints, result.multiFaceLandmarks[0])
  },
})
</script>

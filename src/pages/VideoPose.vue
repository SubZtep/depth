<template lang="pug">
Title Video Display Pose

.top-left
  VideoToPose(@pose="setVideoPose")
  StickmanNormalized(v-if="videoPose" :pose="videoPose" :position="[-2, 0, -10]")

.top-right
  WebcamToPose(@pose="setWebcamPose")
  StickmanNormalized(v-if="webcamPose" :pose="webcamPose" :position="[2, 0, -10]")
</template>

<script lang="ts" setup>
const videoPose = ref<LandmarkList>()
const setVideoPose = (pose?: LandmarkList) => set(videoPose, pose)

const webcamPose = ref<LandmarkList>()
const setWebcamPose = (pose?: LandmarkList) => set(webcamPose, pose)
</script>

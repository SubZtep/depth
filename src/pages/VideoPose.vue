<template lang="pug">
Title Video Display Pose

.top-left
  VideoToPose(@pose="setVideoPose")
  StickmanNormalized(v-if="videoPose" :pose="videoPose" :position="[-2, 0, -10]")

.top-right
  | WebcamPlayer

</template>

<script lang="ts" setup>
const videoPose = ref<LandmarkList>()
const setVideoPose = (pose?: LandmarkList) => set(videoPose, pose)


</script>

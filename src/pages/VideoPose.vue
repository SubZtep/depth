<template lang="pug">
Title Video Display Pose

.top-left
  VideoToPose(@pose="setVideoPose")
  StickmanNormalized(v-if="videoPose" :pose="videoPose" :position="[-2, 0, -10]")

.top-right
  //- WebcamPlayer
  //- pre {{videoTimeUpdated}} {{pose}}

//- StickmanNormalized(v-if="hasPoses" :pose="pose" :position="[-2, 0, -10]")
</template>

<script lang="ts" setup>
import { useVideoStore } from "~/stores/video"

// const videoStore = useVideoStore()
// const { hasId, hasKeyframes, hasPoses } = storeToRefs(videoStore)


// const videoRef = ref<HTMLVideoElement>()
// const setVideoRef = (el?: HTMLVideoElement) => set(videoRef, el)

// const videoEl = ref<HTMLVideoElement>()

const videoPose = ref<LandmarkList>()
const setVideoPose = (pose?: LandmarkList) => set(videoPose, pose)

// gagyi playback
// whenever(and(playing, hasPoses), async () => {
//   console.log("start pose playback")
//   if (videoStore.poses === undefined) return
//   for (const p of videoStore.poses) {
//     console.log("TS", p.ts)
//     set(pose, p.pose_normalized)
//     await sleep(30)
//   }
// })
</script>

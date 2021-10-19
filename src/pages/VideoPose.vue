<template lang="pug">
//- Title Video Display Pose

.top-left.gap-6
  SelectVideoClip(v-slot="{ src, showVideoTag }")

    VideoClipPlayer(
      :controls="!autoStart"
      :src="src"
      v-visible="showVideoTag"
      @mounted="setVideoRef"
      @loaded="videoStore.replace")

    VideoKeyTimes(
      v-if="src && hasId && !hasKeyframes"
      :src="src"
      @done="videoStore.setKeyframes")

    VideoPoses(
      v-if="videoRef && hasId && hasKeyframes"
      :el="videoRef"
      :keyframes="videoStore.keyframes"
      :auto-start="autoStart"
      @pose="videoStore.addPose")

    transition(name="slide")
      StepProgressBar(v-if="src" :items="progressItemsLeft")

//- Debug dff {{autoStart}}

//- .top-right.gap-6
  WebcamPlayer
  //- pre {{videoTimeUpdated}} {{pose}}

//- StickmanNormalized(v-if="hasPoses" :pose="pose" :position="[-2, 0, -10]")
</template>

<script lang="ts" setup>
import { useVideoStore } from "~/stores/video"

const videoStore = useVideoStore()
const { hasId, hasKeyframes, hasPoses } = storeToRefs(videoStore)

const autoStart = toRaw(and(hasId, hasKeyframes, not(hasPoses)))

const videoRef = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(videoRef, el)

const progressItemsLeft = [
  { label: "Video in db", done: hasId },
  { label: "Has keyframes", done: hasKeyframes },
  { label: "Has poses", done: hasPoses },
]

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

<template lang="pug">
//- Title Video Display Pose

.top-left
  GuiSelectVideo(v-slot="{ id, src, showVideoTag }")
    VideoPlayer(
      :src="src"
      v-visible="showVideoTag"
      @mounted="setVideoRef"
      @loaded="videoStore.replace")

    StoreFFmpegKeyframes(v-slot="{ keyframes }")
      StorePoseAI(:el="videoRef" :keyframes="keyframes")

      //-h1 {{ keyframes }}

    //-StoreFFmpegKeyframes(
      v-slot="{ keyframes }"
      v-if="id"
      :src="src"
      @done="videoStore.setKeyframes")

    //-VideoPoses(
      v-if="videoRef && hasId && hasKeyframes"
      :el="videoRef"
      :keyframes="videoStore.keyframes"
      :auto-start="autoStart"
      @pose="videoStore.addPose")

    transition(name="slide")
      .progressSteps(v-if="src")
        ItemProgress(:nr="1" :done="hasId") Video in db
        ItemProgress(:nr="2" :done="hasKeyframes") Has keyframes
        ItemProgress(:nr="3" :done="hasPoses") Has poses

//- Debug dff {{autoStart}}

//- .top-right
  WebcamPlayer
  //- pre {{videoTimeUpdated}} {{pose}}

//- StickmanNormalized(v-if="hasPoses" :pose="pose" :position="[-2, 0, -10]")
</template>

<script lang="ts" setup>
import { useVideoStore } from "~/stores/video"

const videoStore = useVideoStore()
const { hasId, hasKeyframes, hasPoses } = storeToRefs(videoStore)
// toRef
const autoStart = toRaw(and(hasId, hasKeyframes, not(hasPoses)))

const videoRef = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(videoRef, el)

const videoEl = ref<HTMLVideoElement>()

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

<style module>
.progressBar {
  @apply flex flex-col p-2 gap-2 font-serif bg-typepad;
  /* .item {
    @apply flex gap-3 items-center;
  } */
}

:global(.top-left) .progressBar {
  border-radius: 0 0.25rem 0.25rem 0;
  /* .item {
    @apply text-right justify-end text-left flex-row-reverse;
  } */
}

:global(.top-right) .progressBar {
  border-radius: 0.25rem 0 0 0.25rem;
  /* .item {
    @apply text-left justify-end text-right;
  } */
}
</style>

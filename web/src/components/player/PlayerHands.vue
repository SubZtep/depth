<template lang="pug">
WebcamPlayer(
  @mounted="setVideoElement"
  @streaming="setStreaming"
  :folder-closed="true"
  :enabled="true")

PlayerHand(:landmarks="landmarks")
</template>

<script lang="ts" setup>
import { useHands } from "@depth/mediapipe"
import WebcamPlayer from "~/components/video/WebcamPlayer.vue"

const streaming = ref(false)
const setStreaming = (ready: boolean) => set(streaming, ready)

const landmarks: Ref<LandmarkList> = ref()

const { setVideoElement, t } = useHands({
  streaming,
  handler: result => {
    if (result.multiHandLandmarks.length > 0) {
      set(landmarks, result.multiHandLandmarks[0])
    }
    console.log(result)
  },
})
</script>

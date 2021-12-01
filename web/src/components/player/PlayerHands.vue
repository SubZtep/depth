<template lang="pug">
WebcamPlayer(
  @mounted="setVideoElement"
  @streaming="v => streaming = v"
  :folder-closed="false"
  :enabled="true")

PlayerHand(:landmarks="landmarks")
</template>

<script lang="ts" setup>
import { useHands } from "@depth/mediapipe"
import WebcamPlayer from "~/components/video/WebcamPlayer.vue"
import PlayerHand from "~/3D/characters/PlayerHand"

const streaming = ref(false)
const landmarks: Ref<LandmarkList> = ref([])

const { setVideoElement, t } = useHands({
  streaming,
  handler: result => {
    // FIXME: get hand index from handedness and use it to get the landmark
    if (result.multiHandedness.length > 0) {
      set(landmarks, result.multiHandLandmarks[0])
      // set(landmarks, result.multiHandWorldLandmarks[0])
    }
  },
})
</script>

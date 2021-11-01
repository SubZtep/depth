<template lang="pug">
WebcamPlayer(@mounted="setVideoRef" @streaming="isStreaming => streaming = isStreaming")
FaceSimple(:landmarks="landmarks")
</template>

<script lang="ts" setup>
//import { addGuiFolder } from "@depth/dat.gui"
import type { FaceMeshResultsListener } from "@depth/mediapipe"
import { useFaceMesh } from "@depth/mediapipe"

const videoRef = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(videoRef, el)
const streaming = ref(false)
const landmarks = ref()

const handler: FaceMeshResultsListener = res => {
  set(landmarks, res.multiFaceLandmarks)
}

await useFaceMesh({ video: videoRef, streaming, handler })
</script>

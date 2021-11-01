<template lang="pug">
WebcamPlayer(@mounted="setVideoRef" @streaming="isStreaming => streaming = isStreaming")

div(ref="pointsEl" v-if="state.showIndices")
  .absolute.top-0.left-0(:style="`transform: var(--el-pos-${index})`" v-for="index in 468" :key="index") {{index}}

FaceSimple(v-if="pointsEl || !state.showIndices" :landmarks="landmarks" :css-vars-target="pointsEl")
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import type { FaceMeshResultsListener } from "@depth/mediapipe"
import { useFaceMesh } from "@depth/mediapipe"

const pointsEl = ref()
const videoRef = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(videoRef, el)
const streaming = ref(false)
const landmarks = ref()

const handler: FaceMeshResultsListener = res => {
  set(landmarks, res.multiFaceLandmarks)
}

await useFaceMesh({ video: videoRef, streaming, handler })

const state = reactive({
  showIndices: true,
})

addGuiFolder(folder => {
  folder.name = "😬 Face"
  folder.add(state, "showIndices")
})
</script>

<template lang="pug">
WebcamPlayer(@mounted="setVideoReference" @streaming="isStreaming => streaming = isStreaming")

.font-mono.text-sm(ref="pointsElement" v-if="state.showIndices")
  .absolute.top-0.left-0(:style="`transform: var(--el-pos-${index})`" v-for="index in 468" :key="index") {{index}}

FaceSimple(:landmarks="landmarks" :css-vars-target="pointsElement")
</template>

<script lang="ts" setup>
import type { FaceMeshResultsListener } from "@depth/mediapipe"
import { useStats } from "@depth/stats.js"
import { useFaceMesh } from "@depth/mediapipe"
import { addGuiFolder } from "@depth/dat.gui"

const pointsElement = ref()
const video = ref<HTMLVideoElement>()
const setVideoReference = (element?: HTMLVideoElement) => set(video, element)
const streaming = ref(false)
const landmarks = ref()

const handler: FaceMeshResultsListener = result => {
  set(landmarks, result.multiFaceLandmarks)
}

await useFaceMesh({ video, streaming, handler, stats: useStats() })

const state = reactive({
  showIndices: true,
})

addGuiFolder(folder => {
  folder.name = "👽 Face"
  folder.add(state, "showIndices")
})
</script>

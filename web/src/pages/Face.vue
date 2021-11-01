<template lang="pug">
WebcamPlayer(@mounted="setVideoRef" @streaming="isStreaming => streaming = isStreaming")

.font-mono.text-sm(ref="pointsEl" v-if="state.showIndices")
  .absolute.top-0.left-0(:style="`transform: var(--el-pos-${index})`" v-for="index in 468" :key="index") {{index}}

FaceSimple(:landmarks="landmarks" :css-vars-target="pointsEl")
</template>

<script lang="ts" setup>
import type { FaceMeshResultsListener } from "@depth/mediapipe"
import { useStats, Stats } from "@depth/stats.js"
import { useFaceMesh } from "@depth/mediapipe"
import { addGuiFolder } from "@depth/dat.gui"

const pointsEl = ref()
const video = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(video, el)
const streaming = ref(false)
const landmarks = ref()

const statPanel = useStats().addPanel(new Stats.Panel("ms/face", "#f9d71c", "#191970"))
const handler: FaceMeshResultsListener = res => {
  set(landmarks, res.multiFaceLandmarks)
}

await useFaceMesh({ video, streaming, handler, statPanel })

const state = reactive({
  showIndices: true,
})

addGuiFolder(folder => {
  folder.name = "👽 Face"
  folder.add(state, "showIndices")
})

onBeforeUnmount(() => {
  statPanel.dom.parentElement?.removeChild(statPanel.dom)
})
</script>

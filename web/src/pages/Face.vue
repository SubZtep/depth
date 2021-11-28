<template lang="pug">
WebcamPlayer(@mounted="setVideoElement" @streaming="v => streaming = v")

.font-mono.text-sm(ref="pointsElement" v-if="state.showIndices")
  .absolute.top-0.left-0(:style="`transform: var(--el-pos-${index})`" v-for="index in 468" :key="index") {{index}}

FaceSimple(:landmarks="landmarks" :css-vars-target="pointsElement")
</template>

<script lang="ts" setup>
import { useStats, Stats } from "@depth/stats.js"
import { useFaceMesh } from "@depth/mediapipe"
import { addGuiFolder } from "@depth/dat.gui"
import WebcamPlayer from "~/components/video/WebcamPlayer.vue"
import FaceSimple from "~/3D/characters/FaceSimple"

const stats = useStats()
const statPanel = stats.addPanel(new Stats.Panel("ms/face", "#f9d71c", "#191970"))

const pointsElement = ref()
const landmarks = ref()
const streaming = ref(false)

const { setVideoElement, t } = useFaceMesh({
  streaming,
  handler: result => {
    set(landmarks, result.multiFaceLandmarks)
    statPanel.update(get(t), 120)
  },
})

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

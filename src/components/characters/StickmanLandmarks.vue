<template lang="pug">
StickmanSimple(
  v-if="state.showLandmarks"
  :keypoints="pose?.poseLandmarks"
  :z-multi="state.zMulti"
  :color="0xffffff"
  :scale="state.scale")

StickmanSimple(
  v-if="state.showWorldLandmarks"
  :keypoints="pose?.poseWorldLandmarks"
  :z-multi="state.zMulti"
  :color="0x8888ff"
  :scale="state.scale")

CanvasInScene(
  v-if="state.showImage"
  :image="props.pose.image"
  :scale="state.scale")
</template>

<script lang="ts" setup>
import type { Results } from "public/pose"
import { useGuiFolder } from "~/packages/datGUI"
import CanvasInScene from "../CanvasInScene.vue"

const props = defineProps({
  pose: { type: Object as PropType<Results>, required: true },
})

const state = reactive({
  showLandmarks: false,
  showWorldLandmarks: false,
  showImage: false,
  scale: 1,
  zMulti: 0.5,
})

useGuiFolder(folder => {
  folder.name = "🤸 Stickman"
  folder.add(state, "showLandmarks").name("Normal landmarks")
  folder.add(state, "showWorldLandmarks").name("World landmarks")
  folder.add(state, "scale", 0.1, 5, 0.1).name("Scale objects")
  folder.add(state, "zMulti", 0.1, 2, 0.1).name("Z multiplier")
  folder.add(state, "showImage").name("Show image")
})
</script>

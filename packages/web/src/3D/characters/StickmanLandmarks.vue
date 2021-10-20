<template lang="pug">
Debug {{pose.pose_normalized}}

StickmanSimple(
  v-if="state.showLandmarks"
  :keypoints="pose.pose_normalized"
  :z-multi="state.zMulti"
  :color="0xffffff"
  :scale="state.scale"
  :position="props.position")

//- StickmanSimple(
  v-if="state.showWorldLandmarks"
  :keypoints="pose.value.pose_normalized"
  :z-multi="state.zMulti"
  :color="0x8888ff"
  :scale="state.scale"
  :position="props.position")

//-CanvasInScene(
  v-if="state.videoOpacity > 0"
  :image="props.pose.image"
  :scale="state.scale"
  :opacity="state.videoOpacity"
  :position="props.position")
</template>

<script lang="ts" setup>
import type { VideoStatePose } from "~/stores/video"
// import type { Results } from "public/pose"
import { useGuiFolder } from "~/packages/datGUI"

const props = defineProps<{
  // pose: Results
  pose: VideoStatePose
  position: [number, number, number]
}>()

// const raw = ref(props.pose.value.pose_raw)

const state = reactive({
  showLandmarks: true,
  showWorldLandmarks: false,
  videoOpacity: 0.5,
  scale: 1,
  zMulti: 0.5,
})

useGuiFolder(folder => {
  folder.name = "🤸 Stickman"
  folder.add(state, "showLandmarks").name("Normal landmarks")
  folder.add(state, "showWorldLandmarks").name("World landmarks")
  folder.add(state, "scale", 0.1, 5, 0.1).name("Scale objects")
  folder.add(state, "zMulti", 0.1, 2, 0.1).name("Z multiplier")
  folder.add(state, "videoOpacity", 0, 1, 0.1).name("Video opacity")
})
</script>

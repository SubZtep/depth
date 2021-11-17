<template lang="pug">
StickmanSimple(
  v-if="pose"
  :keypoints="pose"
  :z-multi="state.zMulti"
  :color="0xffffff"
  :scale="state.scale"
  :position="props.position")
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"

/* eslint-disable */
const props = defineProps<{
  pose?: NormalizedLandmarkList
  position: [number, number, number]
}>()
/* eslint-enable */

const state = reactive({
  scale: 1,
  zMulti: 0.5,
})

addGuiFolder(folder => {
  folder.name = "🤸 Stickman"
  folder.add(state, "scale", 0.1, 5, 0.1).name("Scale objects")
  folder.add(state, "zMulti", 0.1, 2, 0.1).name("Z multiplier")
})
</script>

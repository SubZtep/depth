<template>
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { Pose } from "@tensorflow-models/pose-detection"
import { watch, toRefs, inject } from "vue"
import { Stickman } from "../../models/stickman"

const props = defineProps({
  pose: { type: Object as PropType<Pose>, required: true },
  videoWidth: { type: Number, required: true },
  videoHeight: { type: Number, required: true },
  scale: { type: Number, required: true },
  zMulti: { type: Number, required: true },
})

const pose = props.pose
const { videoWidth, videoHeight, scale, zMulti } = toRefs(props)

const root = inject<THREE.Group>("root")!
const stickman = new Stickman(root, videoWidth, videoHeight, scale, zMulti)

watch(pose, ({ keypoints }) => {
  // console.log("KP 💀", keypoints)
  stickman.updateJoints(keypoints)
  stickman.updateLines(keypoints)
})
</script>

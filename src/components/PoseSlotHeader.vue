<template lang="pug">
.slotHeader
  div {{poseTypeName(props.poseType)}}
  .big {{props.poses.length}} poses
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { PoseType, poseTypeName } from "../packages/PoseAI"

const props = defineProps({
  poses: { type: Array as PropType<SBPose[]>, required: true },
  poseType: { type: Number as PropType<PoseType>, required: true },
})

</script>

<style scoped>
.slotHeader {
  padding: 4px;
  text-align: center;
  background-color: #3a3b3b;
  color: #f7f2e7;
}
.big {
  margin-top: 3px;
  font-size: 1.5rem;
  line-height: 1.3rem;
}
</style>

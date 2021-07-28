<template lang="pug">
.slot Timestamps: {{props.poses.map(v => v.time).join(', ')}}
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { PoseType } from "../packages/Supabase"

const props = defineProps({
  poses: { type: Array as PropType<SBPose[]>, required: true },
  poseType: { type: Number as PropType<PoseType>, required: true },
})
</script>

<style scoped>
.slot {
  padding: 4px;
  color: #e4e4e2;
  background-color: #477844;
  font-size: 0.5rem;
  line-height: 0.65rem;
  letter-spacing: 1px;
  overflow: auto;
}
</style>

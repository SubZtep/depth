<template>
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { Pose } from "@tensorflow-models/pose-detection"
import { watch } from "vue"

const { pose } = defineProps({ pose: { type: Object as PropType<Pose>, required: true } })

watch(pose, ({ keypoints }) => {
  console.log("KP 💀", keypoints)
}, {
  // immediate: true
})
</script>

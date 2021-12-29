<template lang="pug">
slot(:keypoints="keypoints")
</template>

<script lang="ts" setup>
import { useFace } from "@depth/poser"

const props = defineProps<{
  video: HTMLVideoElement
  streaming: boolean
}>()

const keypoints = ref([] as { x: number; y: number; z: number }[])

useFace({
  streaming: toRef(props, "streaming"),
  video: toRef(props, "video"),
  options: { refineLandmarks: true, selfieMode: false },
  handler: result => {
    if (!result || result.multiFaceLandmarks.length === 0) return

    set(keypoints, result.multiFaceLandmarks[0])
  },
})
</script>

<template lang="pug">
img(:src="src")
</template>

<script lang="ts" setup>
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const props = defineProps<{
  file: string
  fs: FFmpeg["FS"]
}>()

const data = props.fs("readFile", props.file)
const blob = new Blob([data.buffer], { type: "image/png" })
const src = URL.createObjectURL(blob)

onBeforeUnmount(() => {
  URL.revokeObjectURL(src)
})
</script>

<style scoped>
img {
  height: 69px;
  aspect-ratio: var(--video-aspect-ratio);
}
</style>

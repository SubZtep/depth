<template lang="pug">
img(:src="source")
</template>

<script lang="ts" setup>
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const properties = defineProps<{ file: string; fs: FFmpeg["FS"] }>()

const data = properties.fs("readFile", properties.file)
const blob = new Blob([data.buffer], { type: "image/png" })
const source = URL.createObjectURL(blob)

onBeforeUnmount(() => {
  URL.revokeObjectURL(source)
})
</script>

<style scoped>
img {
  height: 69px;
  aspect-ratio: var(--video-aspect-ratio);
}
</style>

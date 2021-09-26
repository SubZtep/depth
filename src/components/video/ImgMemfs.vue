<template lang="pug">
img(:src="src")
</template>

<script lang="ts" setup>
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const props = defineProps({
  file: { type: String, required: true },
  fs: { type: Function as PropType<FFmpeg["FS"]>, required: true },
})

const data = props.fs("readFile", props.file)
const blob = new Blob([data.buffer], { type: "image/png" })
const src = URL.createObjectURL(blob)

onBeforeUnmount(() => {
  URL.revokeObjectURL(src)
})
</script>

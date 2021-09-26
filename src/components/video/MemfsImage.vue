<template lang="pug">
img(:src="src")
</template>

<script lang="ts" setup>
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const props = defineProps({
  filename: { type: String, required: true },
  // eslint-disable-next-line
  // FS: { type: Function as PropType<FFmpeg["FS"]>, required: true },
  fs: { type: Object as any, required: true },
})


console.log("CCCC", props)
const data = props.fs("readFile", props.filename)
const blob = new Blob([data.buffer], { type: "image/png" })
const src = URL.createObjectURL(blob)

onBeforeUnmount(() => {
  URL.revokeObjectURL(src)
})
</script>

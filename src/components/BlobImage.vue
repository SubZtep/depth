<template lang="pug">
img(:src="src")
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { onBeforeUnmount } from "vue"
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const props = defineProps({
  filename: { type: String, required: true },
  FS: { type: Function as PropType<FFmpeg["FS"]>, required: true },
})

const data = props.FS("readFile", props.filename)
const blob = new Blob([data.buffer], { type: "image/png" })
const src = URL.createObjectURL(blob)

onBeforeUnmount(() => {
  URL.revokeObjectURL(src)
  props.FS("unlink", props.filename)
})
</script>

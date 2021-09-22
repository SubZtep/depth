<template lang="pug">
.memfs-commander
  .bg-red-600.inline(v-if="!props.FS")
    | MEMFS is not ready yet.
  div(v-else)
    tt file1
    tt file2.txt
    //- | {{files}}
</template>

<script lang="ts" setup>
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const props = defineProps({
  FS: { type: Function as PropType<FFmpeg["FS"]>, required: false },
})

// @ts-ignore
// const files = props.FS<"readdir">("readdir", "/")
</script>

<style lang="postcss" scoped>
.memfs-commander {
  grid-area: commander;
  @apply h-full bg-blue-500 text-white w-full p-2;

  tt {
    display: block;
  }
}
</style>

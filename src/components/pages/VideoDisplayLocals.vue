<template lang="pug">
Title Video Display Locals
p src: {{state.src}}
</template>

<script lang="ts" setup>
import { useGuiFolder } from "../../packages/datGUI"
import { useVideoDisplay } from "../../composables/useVideoDisplay"
import { useVideoFiles } from "../../composables/useVideoFiles"

const props = defineProps({
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
})

const state = reactive<VideoDisplayLocalsState>({
  src: "",
})

useVideoDisplay({
  video: toRef(props, "video"),
  src: toRef(state, "src"),
})

useGuiFolder("Video Display Locals", folder => {
  folder.add(state, "src", useVideoFiles().selectList())
})
</script>

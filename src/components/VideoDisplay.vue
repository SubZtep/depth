<template lang="pug">
.cameraInput
  video(
    ref="video"
    muted="true"
    playsinline="true"
    crossorigin="anonymous"
    poster="/textures/no-video.png")
  //- video(
    ref="video"
    loop="true"
    muted="true"
    autoplay="true"
    controls="true"
    playsinline="true"
    crossorigin="anonymous"
    v-aspect-ratio="v => ratio = v"
    poster="/textures/no-video.png")
</template>

<script lang="ts" setup>
import { useCssVar } from "@vueuse/core"

const emit = defineEmits(["onRef"])
const video = ref()
const ratio = useCssVar("--video-display-ratio", video)

onMounted(() => emit("onRef", video))
</script>

<style>
.cameraInput {
  grid-area: video;
  justify-self: center;
  line-height: 0;
}

.cameraInput video {
  display: inline-block;
  aspect-ratio: var(--video-display-ratio, 1);
  max-height: 250px;
}
</style>

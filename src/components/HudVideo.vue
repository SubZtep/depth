<template lang="pug">
.hudVideo
  video(
    ref="video"
    muted="true"
    controls="true"
    playsinline="true"
    crossorigin="anonymous")
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
// import { useCssVar } from "@vueuse/core"

const emit = defineEmits(["onRef"])
const video = ref()
// const ratio = useCssVar("--video-display-ratio", video)

onMounted(() => emit("onRef", video))
</script>

<style>
.hudVideo {
  grid-area: video;
  background-color: #0003;
  border: 3px double #669;
  line-height: 0;
}

.hudVideo video {
  /* display: inline-block; */
  /* aspect-ratio: var(--video-display-ratio, 1); */
  max-height: 250px;
}
</style>

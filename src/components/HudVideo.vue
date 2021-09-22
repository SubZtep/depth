<template lang="pug">
.hudVideo
  fa.absolute.top-0.right-0.text-white(:icon="['far', 'tv']" size="2x")

  video(
    ref="video"
    muted="true"
    playsinline="true"
    :controls="showControls"
    crossorigin="anonymous")

  label
    input(type="checkbox" v-model="showControls")
    | Show Video Player Controls
</template>

<script lang="ts" setup>
const emit = defineEmits(["onRef"])
const video = ref()
const showControls = ref(false)

onMounted(() => emit("onRef", video))
</script>

<style scoped>
.hudVideo {
  grid-area: video;
  @apply h-64 relative;
  background-color: #f003;
  /*border: 3px double #669;
  text-align: center;
  line-height: 0; */
}

.hudVideo video {
  /* display: inline-block; */
  /* aspect-ratio: var(--video-display-ratio, 1); */
  /* max-height: 350px; */
}

.hudVideo input {
  accent-color: yellow;
}
</style>

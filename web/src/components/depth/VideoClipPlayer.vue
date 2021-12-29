<template lang="pug">
div(:class="$style.frame" v-visible="state.showVideoTag" ref="frame")
  video.flip-x(
    ref="video"
    v-visible="state.showVideoTag"
    poster="/textures/no-video.png"
    :width="state.width"
    :height="state.height"
    autoplay
    loop
    muted
    :src="state.src")

slot(v-if="video" :video="video" :streaming="!!state.src && state.streaming")
</template>

<script lang="ts" setup>
const video = ref()

const clips = [
  "",
  "/clips/BonyImmaterialFireant-mobile.mp4",
  "/clips/CharmingMarvelousFrillneckedlizard-mobile.mp4",
  "/clips/MellowFewLacewing-mobile.mp4",
  "/clips/WeirdShockedAtlanticsharpnosepuffer-mobile.mp4",
  "/clips/WindySecondaryLark-mobile.mp4",
]

const state = reactive({
  showVideoTag: false,
  width: 320,
  height: 240,
  src: "",
  streaming: false,
})

addGuiFolder(folder => {
  folder.name = "📹 Video Clip Player"
  folder.add(state, "src", clips).name("Clip")
  folder.add(state, "showVideoTag").name("Show video tag")
  folder.add(state, "streaming").name("Streaming")
})
</script>

<style module>
.frame {
  @apply video-border resize-x inline-block overflow-hidden;
  max-width: var(--max-width);
  /* aspect-ratio: var(--aspect-ratio); */
  height: auto;
}
</style>

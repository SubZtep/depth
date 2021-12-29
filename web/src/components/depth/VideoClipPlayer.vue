<template lang="pug">
div(:class="$style.frame" v-visible="state.showVideoTag" ref="frame")
  video.flip-x(
    ref="video"
    v-visible="state.showVideoTag"
    poster="/textures/no-video.png"
    :width="state.width"
    :height="state.height"
    loop
    muted)

slot(v-if="video" :video="video" :streaming="streaming && state.streaming")
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import { nextTick } from "vue"

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

const video = ref()
const streaming = ref(false)

watch(
  () => state.src,
  async src => {
    streaming.value = false
    video.value?.pause()
    await nextTick()
    if (src) {
      video.value.src = src
      video.value.play()
    }
  },
  { immediate: true, flush: "post" }
)

useEventListener(video, "loadedmetadata", () => {
  state.width = video.value.videoWidth
  state.height = video.value.videoHeight
  streaming.value = true
})

addGuiFolder(folder => {
  folder.name = "📹 Video Clip Player"
  folder.add(state, "src", clips).name("Clip")
  folder.add(state, "showVideoTag").name("Show video tag")
  folder.add(state, "streaming").name("Streaming")
})

onScopeDispose(() => {
  streaming.value = false
  video.value?.pause()
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

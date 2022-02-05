<template lang="pug">
div(:class="$style.frame" v-visible="state.showVideoTag" ref="frame")
  video(
    :class="{ 'flip-x': !!props.selfie }"
    ref="video"
    v-visible="state.showVideoTag"
    poster="/textures/no-video.png"
    :width="state.width"
    :height="state.height"
    autoplay
    muted)

slot(v-if="video" :video="video" :streaming="streaming")
</template>

<script lang="ts" setup>
import { normalizeDeviceLabel } from "@depth/misc"
import { useDevicesList, useUserMedia } from "@vueuse/core"

const video = ref()

const state = reactive({
  showVideoTag: false,
  videoDeviceId: "",
  width: 640,
  height: 480,
})

const props = defineProps<{
  selfie?: boolean
}>()

const { videoInputs } = useDevicesList({ requestPermissions: true, constraints: { audio: false, video: true } })
const cameras = computed(() =>
  Object.fromEntries(get(videoInputs).map(v => [v.deviceId, normalizeDeviceLabel(v.label)]))
)

const media = useUserMedia({ audioDeviceId: false, videoDeviceId: state.videoDeviceId })
const streaming = computed(() => !!media.stream.value)

watch(
  streaming,
  isStreaming => {
    video.value.srcObject = isStreaming ? media.stream.value : null
  },
  { flush: "post" }
)

addGuiFolder(folder => {
  folder.name = "📹 Webcam Player"
  folder.add(state, "videoDeviceId", cameras).name("Device")
  folder.add(state, "showVideoTag").name("Show video tag")
  folder.add(media, "enabled").name("Camera is ON")
})

onScopeDispose(() => {
  media.stop()
})
</script>

<style module>
.frame {
  @apply video-border resize-x inline-block overflow-hidden;
  width: 285px;
  /* max-width: var(--max-width); */
  /* aspect-ratio: var(--aspect-ratio); */
  height: auto;
}
</style>

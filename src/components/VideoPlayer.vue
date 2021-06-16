<template lang="pug">
video(
  show
  muted
  autoplay
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png"
  :class="{ visible: videoState.visible }")
</template>

<script lang="ts" setup>
import { useDocumentVisibility, useUserMedia, get } from "@vueuse/core"
import { ref, defineEmit, computed, watch, useContext, onMounted } from "vue"
import { useGlobalState } from "../store"

const visibility = useDocumentVisibility()
const state = useGlobalState()

const elId = useContext().attrs.id
const videoState = state.videos.find(v => v.id === elId)!
const src = computed(() => videoState.src)

const camEnabled = computed(() => !get(src) && state.camera.on && get(visibility) === "visible")

const { stream, enabled, start, stop } = useUserMedia({
  audioDeviceId: false,
  videoDeviceId: state.camera.deviceId,
  enabled: computed(() => !get(src) && state.camera.on && get(visibility) === "visible"),
})

const emit = defineEmit(["playing", "pause"])
const videoRef = ref<HTMLVideoElement>()

onMounted(() => {
  const video = get(videoRef)!  

  // video.addEventListener("canplay", () => {
  //   console.log("CAN PLAY")
  // })

  video.addEventListener("playing", () => {
    emit("playing", video)
  })

  video.addEventListener("pause", () => {
    emit("pause", video)
  })

  watch(stream, newStream => {
    if (!newStream) {
      emit("pause", video)
    }
    video.srcObject = newStream || null
  }, { immediate: true })

  watch(src, newSrc => {
    video.src = newSrc
  }, { immediate: true })

  // watch(visibility, async newVisibility => {
  //   if (newVisibility === "visible" && !video.isPlaying) {
  //     await video.play()
  //   }
  //   if (newVisibility === "hidden" && video.isPlaying) {
  //     video.pause()
  //   }
  // })
})
</script>
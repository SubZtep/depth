<template lang="pug">
//- div(style="background: red; z-index: 1000; padding: 200px; width: 100px;") HELLO {{state.piles}}
video(
  show
  muted
  autoplay
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png"
  :class="{ visible: true }")
  //- :class="{ visible: state.piles.find(v => v.id === elId)?.videoPlayer.visibleEl }")
</template>

<script lang="ts" setup>
import { useDocumentVisibility, useUserMedia, get, unrefElement } from "@vueuse/core"
import { ref, defineEmit, computed, watch, useContext, onMounted, defineProps } from "vue"
import { useGlobalState } from "../store"
import { useSingleton } from "../composables/useSingleton"

const { pid } = defineProps({ pid: { type: String, required: true } })

const visibility = useDocumentVisibility()
// const state = useGlobalState()
const state = useGlobalState()
const { piles } = useSingleton()

// const elId = useContext().attrs.id as string
// const videoState = state.videos.find(v => v.id === elId)!
// const src = computed(() => videoState.src)

watch(state, () => {
  console.log("state changed")
})

const { stream, enabled, start, stop } = useUserMedia({
  audioDeviceId: false,
  videoDeviceId: state.camera.deviceId,
  // enabled: true
  enabled: computed(() => state.camera.on && get(visibility) === "visible"),
})

const emit = defineEmit(["playing", "pause"])
const videoRef = ref<HTMLVideoElement>()

onMounted(() => {
  const video = unrefElement(videoRef)
  // const pile = piles.get(elId)
  const pile = piles.get(pid)
  pile.applyVideoPlayerTexture(video)

  // piles.get(elId).addVideoSource(video)

  // video.addEventListener("canplay", () => {
  //   console.log("CAN PLAY")
  // })

  video.addEventListener("playing", () => {
    // pile.applyVideoPlayerTexture(video)
    emit("playing", video)
  })

  video.addEventListener("pause", () => {
    emit("pause", video)
  })

  watch(
    stream,
    newStream => {
      // console.log("STREAAMMM", newStream)
      if (!newStream) {
        emit("pause", video)
      }
      video.srcObject = newStream || null
    },
    { immediate: true }
  )

  // watch(src, newSrc => {
  //   video.src = newSrc
  // }, { immediate: true })

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
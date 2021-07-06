<template lang="pug">
video(
  ref="videoRef"
  loop="true"
  muted="true"
  autoplay="true"
  controls="true"
  playsinline="true"
  poster="/textures/no-video.png")
</template>

<script lang="ts" setup>
import type { PropType, Ref } from "vue"
import type { UseMediaControlsReturn } from "@vueuse/core"
import { not, set, get, whenever, useMediaControls, useEventListener, until } from "@vueuse/core"
import { onMounted, onBeforeUnmount, ref, toRef, watch, computed } from "vue"

const props = defineProps({
  src: { type: String, required: true },
  // forwardRef: { type: Object as PropType<HTMLVideoElement | undefined>, required: true },
  // constrols: { type: Object as PropType<UseMediaControlsReturn>, required: true }
})


// const videoRef = toRef(props, "forwardRef")

// props.constrols

const src = toRef(props, "src")

const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const { playing } = useMediaControls(videoRef, { src })

// const src = toRef(props, "src")


const emit = defineEmits(["play", "pause"])

watch(playing, isPlaying => {
  if (isPlaying) {
    emit("play", videoRef)
  } else {
    emit("pause")
  }
})

// onMounted(() => {
//   // emit("init", { videoRef, controls })
//   // emit("playing", controls.playing)
// })

whenever(not(src), () => {
  set(playing, false)
  const video = get(videoRef)
  video.pause()
  video.removeAttribute("src")
  video.load()
})

// const emptyRef = ref<HTMLVideoElement>()
// const props = defineProps({ src: { type: String, required: true } })
// const src = toRef(props, "src")

// const emit = defineEmits(["init", "playing"])
// emit("playing", playing)

// const emit = defineEmits(["updated", "dimensions"])

// useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
//   const { videoWidth, videoHeight } = target
//   emit("dimensions", { videoWidth, videoHeight })
// })

// const readyState = computed(() => videoRef.value.readyState)

// watch(playing, async isPlaying => {
//   if (isPlaying) {
//     const video = get(videoRef)
//     await until(readyState).toBe(video.HAVE_ENOUGH_DATA)
//     // await until(video.readyState).toBe(video.HAVE_ENOUGH_DATA)
//     emit("playing", video)
//   } else {
//     emit("playing", undefined)
//   }
// }, { immediate: true })


// onMounted(() => {
//   // watch(playing, isPlaying => emit("updated", isPlaying ? videoRef : emptyRef), { immediate: true })
//   // watch(playing, isPlaying => emit("playing", isPlaying ? get(videoRef) : null), { immediate: true })

//   // emit("init", videoRef)
// })

// onBeforeUnmount(() => {
//   // emit("updated", emptyRef)
//   // emit("playing", undefined)
// })
</script>

<template lang="pug">
//- h1 P {{props}}
video(
  loop
  muted
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png"
  :class="{ visible: opts.showEl }")
  //- source(:src="opts.src" :type="`video/${opts.src.split('.').pop()}`")
  source(:src="opts.src")
</template>

<script lang="ts" setup>
// import { get } from "@vueuse/core"
import { defineProps, markRaw, ref } from "vue"
import { useInputGroup } from "../composables/useInputGroup"

// const { opts } = defineProps({ opts: { type: Object as PropType<VideoInputGroup>, required: true } })
const { opts } = defineProps({ opts: { type: Object as PropType<VideoInputGroup>, required: true } })
// console.log("AAA", markRaw(opts))
// const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
// useInputGroup<VideoInputGroup>(opts, videoRef)
</script>

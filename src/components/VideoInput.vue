<template lang="pug">
video(
  loop
  muted
  controls
  playsinline
  ref="videoRef"
  poster="no-video.png"
  :class="{ visible: opts.showEl }")
  source(:src="opts.src" :type="`video/${opts.src.split('.').pop()}`")
</template>

<script lang="ts" setup>
import { unrefElement, get, until, useUserMedia, invoke } from "@vueuse/core"
import { defineProps,ref } from "vue"
import { useInputGroup } from "../composables/useInputGroup"

const { opts } = defineProps({ opts: { type: Object as PropType<VideoInputGroup>, required: true } })
const videoRef = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
// useInputGroup<VideoInputGroup>(opts, videoRef)
useInputGroup<MediaInputGroup>(opts, videoRef)
</script>

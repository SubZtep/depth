<template lang="pug">
.videoTimeline
  TimelineToolbar
  .flex
    .flex-shrink-0.w-100px.bg-red-500
    .timeline(ref="timeline" :class="{ grabbing: isSwiping }")
      template(v-if="timeline")
        TimelineCanvas(
          :wrapper="timeline"
          :duration="controls.duration"
          :frame-times="ff.keypoints")

        div
          ImgMemfs(
            v-if="props.ff.keypoints.value.length > 0"
            :file="props.ff.getKeyframeFilename(props.ff.keypoints.value[0])"
            :fs="props.ff.ffmpeg.FS")

          TimelineCursor(
            :wrapper="timeline"
            @pressed="handleCursorClick")
</template>

<script lang="ts" setup>
// import { UseMediaControlsReturn, usePointerSwipe } from "@vueuse/core"
import { updateVideoTime } from "../../misc/utils"
import TimelineToolbar from "./TimelineToolbar.vue"
// import { useFFmpeg } from "~/packages/FFmpeg/useFFmpg"
import { useFFmpeg } from "~/packages/FFmpeg/useFF"
import ImgMemfs from "./ImgMemfs.vue"

const props = defineProps({
  // frameTimes: { type: Array as PropType<number[]>, required: true },
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
  // keypoints: { type: Object as PropType<Ref<number[]>>, required: true },
  controls: { type: Object as PropType<UseMediaControlsReturn>, required: true },
  ff: { type: Object as PropType<ReturnType<typeof useFFmpeg>>, required: true }
})

const timeline = ref<HTMLDivElement>()
let canvas: HTMLCanvasElement

const zoomLevel = ref(0)
provide("zoomLevel", zoomLevel)

onMounted(() => {
  nextTick(() => {
    canvas = get(timeline)!.querySelector("canvas")!
  })
})

const { distanceX, isSwiping } = usePointerSwipe(timeline, {
  onSwipeStart(e: PointerEvent) {
    e.stopPropagation()
  },
  onSwipe(e: PointerEvent) {
    const speed = get(timeline)!.clientWidth / canvas.width
    get(timeline)!.scrollLeft -= (distanceX.value * speed) / 100
  },
})

const handleCursorClick = (x: number) => {
  const gapSecPx = Math.round(get(timeline)!.clientWidth / get(props.controls.duration)) + get(zoomLevel)
  const time = (x + get(timeline)!.scrollLeft) / get(gapSecPx)
  // console.log("PRESS", time)
  set(props.controls.currentTime, time)
}
</script>

<style lang="postcss" scoped>
.videoTimeline {
  @apply top-0 left-0 w-128 absolute;
  /* @apply relative; */
  /* grid-area: timeline; */
  /* cursor: grab; */
  /* position: relative; */
  /* @apply h-full w-full; */

  background-color: #dedede88;
  border: 3px inset #000;
  /* border-radius: 4px; */
  border-top-width: 1px;
  overflow: hidden;
  resize: horizontal;
  /* width: 66vw;
  max-height: 12rem; */
  /* &.grabbing {
    cursor: grabbing;
  } */
}

.timeline {
  @apply flex-grow relative;
  overflow-y: hidden;
  cursor: grab;
  &.grabbing {
    cursor: grabbing;
  }
}
</style>

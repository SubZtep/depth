<template lang="pug">
.videoTimeline(ref="timeline" :class="{ grabbing: isSwiping }")
  TimelineToolbar
  template(v-if="timeline")

    TimelineCanvas(
      :wrapper="timeline"
      :frame-times="props.ff.video.frameTimes")

    TimelineCursor(
      :wrapper="timeline"
      @pressed="handleCursorClick")
</template>

<script lang="ts" setup>
import { usePointerSwipe } from "@vueuse/core"
import { updateVideoTime } from "../../misc/utils"
import TimelineToolbar from "./TimelineToolbar.vue"
import { useFFmpeg } from "~/packages/FFmpeg/useFFmpg"

const props = defineProps({
  // frameTimes: { type: Array as PropType<number[]>, required: true },
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
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

const handleCursorClick = async (x: number) => {
  // const duration = props.frameTimes.at(-1) || 0
  const duration = props.ff.video.frameTimes?.at(-1) || 0
  const gapSecPx = Math.round(get(timeline)!.clientWidth / duration) + get(zoomLevel)
  const time = (x + get(timeline)!.scrollLeft) / get(gapSecPx)
  console.log("PRESS", time)
  await updateVideoTime(props.video, time)
}
</script>

<style lang="postcss">
.videoTimeline {
  /* @apply relative; */
  grid-area: timeline;
  cursor: grab;
  /* position: relative; */
  @apply h-full w-full;
  overflow-y: hidden;
  background-color: #dedede88;
  border: 3px inset #000;
  border-radius: 4px;
  border-top-width: 1px;
  /* width: 66vw;
  max-height: 12rem; */
  &.grabbing {
    cursor: grabbing;
  }
}
</style>

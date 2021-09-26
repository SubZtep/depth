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
import TimelineToolbar from "./TimelineToolbar.vue"
import { useFFmpeg } from "~/packages/FFmpeg/useFFmpeg"
import ImgMemfs from "./ImgMemfs.vue"

const props = defineProps({
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
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
  set(props.controls.currentTime, time)
}
</script>

<style lang="postcss" scoped>
.videoTimeline {
  @apply top-0 left-0 w-128 absolute;
  background-color: #aaa;
  border: 3px inset #000;
  border-top-width: 1px;
  overflow: hidden;
  resize: horizontal;
}

.timeline {
  @apply flex-grow relative;
  overflow-x: scroll;
  overflow-y: hidden;
  cursor: grab;
  &.grabbing {
    cursor: grabbing;
  }

  scrollbar-width: thin;
  scrollbar-color: #efe #000;

  &::-webkit-scrollbar {
    background-color: #1234;
    height: 12px;
    width: 12px;
    cursor: pointer;
  }

  &::-webkit-scrollbar-thumb {
    background-image: radial-gradient(#eefeee 0%, #0000 69%);
  }
}
</style>

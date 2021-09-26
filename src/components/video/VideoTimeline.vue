<template lang="pug">
div(:class="$style.videoTimeline" v-stop-propagation)

  div(:class="$style.toolbar")
    slot(name="toolbar")

  .flex
    .flex-shrink-0.w-100px
      div(:class="$style.ruler") ruler
      div(:class="$style.pictures") pictures

    div(ref="timeline" :class="{ [$style.timeline]: true, grabbing: isSwiping }")
      template(v-if="timeline")

        TimelineCanvas(
          :class="$style.ruler"
          :wrapper="timeline"
          :duration="controls.duration"
          :frame-times="ff.keypoints")

        div
          div(:class="$style.pictures")
            ImgMemfs(
              v-if="props.ff.keypoints.value.length > 0"
              :file="props.ff.getKeyframeFilename(props.ff.keypoints.value[0])"
              :fs="props.ff.ffmpeg.FS")

          TimelineCursor(
            :wrapper="timeline"
            @pressed="handleCursorClick")
</template>

<script lang="ts" setup>
import { useFFmpeg } from "~/packages/FFmpeg/useFFmpeg"
import ImgMemfs from "./ImgMemfs.vue"

const props = defineProps({
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
  controls: { type: Object as PropType<UseMediaControlsReturn>, required: true },
  ff: { type: Object as PropType<ReturnType<typeof useFFmpeg>>, required: true },
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

  //FIXME: has to round otherwise "controls" reduce it and watch fires twice. maybe closestPoseInTime?
  const time = Number(((x + get(timeline)!.scrollLeft) / get(gapSecPx)).toFixed(6))

  set(props.controls.currentTime, time)
}
</script>

<style lang="postcss" module>
.videoTimeline {
  @apply top-0 left-0 w-128 absolute;
  /* background-color: #aaa; */
  /* border: 3px inset #000; */
  /* border-top-width: 1px; */
  overflow: hidden;
  resize: horizontal;
}

.toolbar {
  @apply flex bg-gray-500 p-2 text-light-50 items-center justify-between;
}

.timeline {
  @apply flex-grow relative scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300;

  overflow-x: scroll;
  overflow-y: hidden;
  cursor: grab;
  &.grabbing {
    cursor: grabbing;
  }
}

.ruler {
  height: 28px;
  @apply bg-blue-500;
}

.pictures {
  @apply bg-blue-600;
  height: 69px;
}
</style>

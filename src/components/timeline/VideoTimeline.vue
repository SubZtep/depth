<template lang="pug">
.videoTimeline(ref="timeline" :class="{ grabbing: isSwiping }")
  template(v-if="timeline")

    TimelineCanvas(
      :wrapper="timeline"
      :frame-times="props.frameTimes")

    TimelineCursor(
      :wrapper="timeline"
      @pressed="handlePressed")
</template>

<script lang="ts" setup>
import { usePointerSwipe } from "@vueuse/core"

const props = defineProps({
  frameTimes: { type: Array as PropType<number[]>, required: true },
  // video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
})

const timeline = ref<HTMLDivElement | null>(null)
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

const handlePressed = (x: number) => {
  const duration = props.frameTimes.at(-1) || 0
  const gapSecPx = Math.round(get(timeline)!.clientWidth / duration) + get(zoomLevel)
  const time = (x + get(timeline)!.scrollLeft) / get(gapSecPx)
  console.log("PRESS", time)
}
</script>

<style lang="postcss">
.videoTimeline {
  align-self: center;
  cursor: grab;
  position: relative;
  overflow-y: hidden;
  background-color: #6669;
  border: 1px solid #333;
  width: 50rem;
  height: 5rem;
  /* box-sizing: content-box; */
  &.grabbing {
    cursor: grabbing;
  }
}
</style>

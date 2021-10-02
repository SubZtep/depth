<template lang="pug">
div(:class="$style.videoTimeline" v-stop-propagation)

  div(:class="$style.toolbar")
    .flex.gap-1
      button.btn-icon(@click="state.zoom--" :disabled="state.zoom === 0")
        fa(:icon="['far', 'magnifying-glass-minus']")
      button.btn-icon(@click="state.zoom++")
        fa(:icon="['far', 'magnifying-glass-plus']")
    div
      label
        input(type="checkbox" v-model="estimatePose")
        span.ml-2 Estimate pose

  .flex
    .flex-shrink-0.w-100px
      div(:class="$style.ruler") ruler
      div(:class="$style.pictures") pictures
      div(:class="$style.detected") detected

    div(ref="timeline" :class="{ [$style.timeline]: true, grabbing: isSwiping }")
      template(v-if="timeline !== null")

        TimelineCursor(
          :wrapper="timelineFn"
          :gap-sec-px="gapSecPx"
          @select-time="(time: number) => props.controls.currentTime.value = time")

        TimelinePlayhead(
          :gap-sec-px="gapSecPx"
          :current-time="props.controls.currentTime")

        TimelineCanvas(
          v-model:zoom="state.zoom"
          :gap-sec-px="gapSecPx"
          :class="$style.ruler"
          :wrapper="timelineFn"
          :duration="controls.duration"
          :frame-times="props.ff.keypoints")

        div(:class="$style.pictures")
          ImgMemfs(
            v-if="props.ff.keypoints.value.length > 0"
            :file="props.ff.getKeyframeFilename(props.ff.keypoints.value[0])"
            :fs="props.ff.ffmpeg.FS")

        div(:class="$style.detected")

Debug
  h1 {{typeof timeline}}
  div zoom: {{state.zoom}}
  div duration: {{props.controls.duration}}
  div currentTime: {{props.controls.currentTime}}
  div gapSecPx: {{gapSecPx}}
</template>

<script lang="ts" setup>
import type { UseMediaControlsReturn } from "@vueuse/core"
import { useFFmpeg } from "~/packages/FFmpeg"
import ImgMemfs from "./ImgMemfs.vue"

const props = defineProps({
  controls: { type: Object as PropType<UseMediaControlsReturn>, required: true },
  ff: { type: Object as PropType<AsyncReturnType<typeof useFFmpeg>>, required: true },
  estimatePose: { type: Boolean, required: true },
})

const estimatePose = useVModel(props, "estimatePose")
const timeline = ref<HTMLDivElement | null>(null)
const timelineFn = computed(() => timeline as Ref<HTMLDivElement>)
let canvas: HTMLCanvasElement

const state = reactive({
  zoom: 0,
})

const { width } = useElementSize(timeline)

const gapSecPx = computed(() => {
  if (get(width) === 0 || get(props.controls.duration) === 0) return 0
  return Number((get(width) / get(props.controls.duration)).toFixed(6)) + state.zoom
})

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
</script>

<style lang="postcss" module>
.videoTimeline {
  @apply top-0 left-0 w-128 absolute overflow-hidden resize-x;
}

.toolbar {
  @apply flex bg-gray-500 p-2 text-light-50 items-center justify-between;
}

.timeline {
  @apply flex-grow relative overflow-hidden;

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

.detected {
  @apply bg-blue-700;
  height: 15px;
}
</style>

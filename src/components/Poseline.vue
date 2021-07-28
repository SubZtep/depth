<template lang="pug">
canvas.notches(ref="notches" height="50")
//- h1.shout xxx {{props.poses}}
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { get, set, not, throttledWatch, useEventListener, useMouseInElement, useMousePressed, usePointerSwipe, whenever } from "@vueuse/core"

const props = defineProps({
  poses: { type: Object as PropType<SBPose[]>, required: true },
})


// const gapSecPx = ref(10)
const gapSecPx = ref(70)
const notches = ref<HTMLCanvasElement>()


onMounted(() => {
  const ctx = get(notches)!.getContext("2d")!
  const draw = drawer(ctx)

  const duration = props.poses.concat().sort((a, b) => b.time - a.time)[0].time
  ctx.canvas.width = duration * get(gapSecPx)
  // TODO: make with Timeline common watcher
  // draw(duration, get(gapSecPx))
})
</script>

<script lang="ts">
const drawer = (ctx: CanvasRenderingContext2D) => (secs: number, gapSec: number) => {
  const height = ctx.canvas.height
  ctx.fillStyle = "#f00"
  ctx.fillRect(0, 0, ctx.canvas.width, height)

  return
  ctx.strokeStyle = "#eee"
  ctx.lineWidth = 1

  ctx.beginPath()
  for (let i = 0; i < secs; i++) {
    const x = i * gapSec

    let notchHeight = height - 8

    ctx.moveTo(x, height - notchHeight)
    ctx.lineTo(x, height)
  }
  ctx.stroke()
}
</script>

<style scoped>
.shout { color: yellow; }

/* .notches {
  position: absolute;
} */
</style>

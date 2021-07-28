<template lang="pug">
.timelineGrid.miniScrollbar(ref="wrapper")
  .time TIME
  .timeline TIMELINE
  //- canvas.notches(ref="notches" height="27")

  //- .slots(:class="{ cursorGrabbing: isSwiping }")
  .slotHeader SHEAD
  .slot SLOT
  .slotHeader SHEAD
  .slot SLOT
  .slotHeader SHEAD
  .slot SLOT
    //- slot

  //- .cursor(ref="cursor" v-show="isInside")
</template>

<script lang="ts" setup>
import type { MaybeRef } from "@vueuse/core"
import { get, set, not, throttledWatch, useEventListener, useMouseInElement, useMousePressed, usePointerSwipe, whenever } from "@vueuse/core"

const emit = defineEmits(["time"])
const props = defineProps({
  /** video length in seconds */
  duration: { type: Number, required: true },
})

// const gapSecPx = ref(10)
const gapSecPx = ref(60)

const wrapper = ref<HTMLDivElement>()
const notches = ref<HTMLCanvasElement>()
const cursor = ref<HTMLDivElement>()

// const { elementX, isOutside } = useMouseInElement(wrapper)
// const isInside = not(isOutside)

// useEventListener(wrapper, "wheel", ({ deltaY }: WheelEvent) => set(gapSecPx, nextGapSize(gapSecPx, deltaY)), { passive: true })

// const { distanceX, isSwiping } = usePointerSwipe(wrapper, {
//   onSwipe(e: PointerEvent) {
//     // @ts-ignore
//     if (e.target.nodeName !== "CANVAS") {
//       const speed = get(wrapper)!.clientWidth / get(notches)!.width
//       get(wrapper)!.scrollLeft -= (distanceX.value * speed) / 100
//     }
//   },
// })

// const { pressed } = useMousePressed({ target: notches })
// whenever(pressed, () => {
//   const time = (get(elementX) + get(wrapper)!.scrollLeft) / get(gapSecPx)
//   emit("time", time)
// })

onMounted(() => {
  // const ctx = get(notches)!.getContext("2d")!
  // const draw = drawer(ctx)

  // set(gapSecPx, get(wrapper)!.clientWidth / props.duration)

  // watchEffect(() => {
  //   get(cursor)!.style.left = `${get(elementX) + get(wrapper)!.scrollLeft}px`
  // })

  // throttledWatch(
  //   [() => props.duration, gapSecPx],
  //   () => {
  //     ctx.canvas.width = props.duration * get(gapSecPx)
  //     draw(props.duration, get(gapSecPx))
  //   },
  //   { immediate: true, throttle: 50 }
  // )
})
</script>

<script lang="ts">
const nextGapSize = (gapSec: MaybeRef<number>, direction: number) => {
  const gap = get(gapSec)

  const newGap = gap + Math.sign(direction)
  return newGap > 2 && newGap < 200 ? newGap : gap
}

const drawer = (ctx: CanvasRenderingContext2D) => (secs: number, gapSec: number) => {
  const height = ctx.canvas.height
  ctx.fillStyle = "#333"
  ctx.fillRect(0, 0, ctx.canvas.width, height)

  ctx.strokeStyle = "#eee"
  ctx.lineWidth = 1
  ctx.font = "9pt Verdana"

  ctx.beginPath()
  for (let i = 0; i < secs; i++) {
    const x = i * gapSec
    const isTensec = i % 10 === 0
    const isMin = i % 60 === 0

    let notchHeight = height - 8
    if (!isTensec) notchHeight -= 5
    if (!isMin) notchHeight -= 5

    ctx.moveTo(x, height - notchHeight)
    ctx.lineTo(x, height)

    if (isTensec || isMin) {
      ctx.fillStyle = isMin ? "#fff" : "#ccc"
      ctx.fillText(formatToTimeline(i), x + 6, 13)
    }
  }
  ctx.stroke()
}

const formatToTimeline = (secs: number) => {
  const mins = Math.floor(secs / 60)
  const s = secs - mins * 60
  return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}
</script>

<style scoped>
.timelineGrid {
  color: #ff0;
  height: 100%;
  display: grid;
  gap: 8px;
  grid-template-columns: 100px 1fr;
  grid-template-rows: 27px auto;
  grid-auto-flow: row;
}

.timelineGrid > * {
  background-color: #3f31;
}

.timeline {
  background-color: red;
}

.cursorGrabbing {
  cursor: grabbing;
}

.notches {
  /* position: absolute; */
  cursor: crosshair;
}

.slotHeader {
  min-height: 100px;
}

.slots {
  /* flex-grow: 1; */
  cursor: grab;
  /* overflow: auto; */
  /* background: #ff0; */
  background-color: #fff;
}

/* .cursor {
  pointer-events: none;
  position: absolute;
  width: 1px;
  background-color: #ff0;
  top: 0;
  bottom: 0;
} */
</style>

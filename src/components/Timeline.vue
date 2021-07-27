<template lang="pug">
div(ref="wrapper" :class="{ [$style.timeline]: true, [$style.swiping]: isSwiping }")
  canvas(ref="notches" height="50")
  div(ref="cursor" :class="$style.cursor" v-show="isInside")
</template>

<script lang="ts" setup>
import type { MaybeRef } from "@vueuse/core"
import { get, set, not, throttledWatch, useEventListener, useMouseInElement, useMousePressed, usePointerSwipe, whenever } from "@vueuse/core"

const emit = defineEmits(["time"])

const props = defineProps({
  /** length in seconds */
  length: { type: Number, required: true },
})
const { length } = toRefs(props)

const gapSec = ref(10)

const wrapper = ref<HTMLDivElement>()
const notches = ref<HTMLCanvasElement>()
const cursor = ref<HTMLDivElement>()

const { elementX, isOutside } = useMouseInElement(wrapper)
const isInside = not(isOutside)

useEventListener(wrapper, "wheel", ({ deltaY }: WheelEvent) => {
  const directon = Math.sign(deltaY)
  if (isGapMutable(gapSec, directon)) {
    set(gapSec, get(gapSec) + directon)
  }
}, { passive: true })

const { distanceX, isSwiping } = usePointerSwipe(wrapper, {
  onSwipe(e: PointerEvent) {
    // @ts-ignore
    if (e.target.nodeName !== "CANVAS") {
      const speed = get(wrapper)!.clientWidth / get(notches)!.width
      get(wrapper)!.scrollLeft -= distanceX.value * speed / 100
    }
  }
})

const { pressed } = useMousePressed({ target: notches })
whenever(pressed, () => {
  const time = (get(elementX) + get(wrapper)!.scrollLeft) / get(gapSec)
  emit("time", time)
})

onMounted(() => {
  const ctx = get(notches)!.getContext("2d")!
  ctx.lineWidth = 1
  ctx.font = "52pt Tahoma"
  const draw = drawer(ctx)

  watchEffect(() => {
    get(cursor)!.style.left = `${get(elementX) + (get(wrapper)!.scrollLeft)}px`
  })

  throttledWatch([length, gapSec], () => {
    ctx.canvas.width = get(length) * get(gapSec)
    draw(props.length, get(gapSec))
  }, { immediate: true, throttle: 50 })
})
</script>

<script lang="ts">
const isGapMutable = (gapSec: MaybeRef<number>, direction: number) => {
  const newGap = get(gapSec) + direction
  return newGap > 2 && newGap < 20
}

const drawer = (ctx: CanvasRenderingContext2D) => (secs: number, gapSec: number) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.beginPath()
  for (let i = 0; i < secs; i++) {
    const x = i * gapSec
    const isTensec = i % 10 === 0
    const isMin = i % 60 === 0

    let height = 20
    if (isTensec) height += 10
    if (isMin) height += 10

    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)

    if (isTensec || isMin) {
      ctx.fillStyle = isMin ? "#000000" : "#696969"
      ctx.fillText(formatToTimeline(i), x + 6, 34)
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

<style module>
.timeline {
  display: block;
  height: 100px;
  border: 2px solid red;
  background-color: lightgray;
  position: relative;
  box-sizing: content-box;
  /* pointer-events: auto; */
  cursor: grab;

  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: blue red;
}

.timeline::-webkit-scrollbar {
  background-color: red;
  height: 8px;
}

.timeline::-webkit-scrollbar-thumb {
  background-color: blue;
}

.swiping {
  cursor: grabbing;
}

.timeline canvas {
  position: absolute;
  cursor: crosshair;
}

.cursor {
  cursor: inherit;
  position: absolute;
  width: 1px;
  background-color: #ff0;
  top: 0;
  bottom: 0;
}
</style>

<template lang="pug">
h1 {{isSwiping}}
div(ref="wrapper" :class="{ [$style.timeline]: true, [$style.swiping]: isSwiping }")
  canvas(ref="notches" height="50")
  div(ref="cursor" :class="$style.cursor" v-show="isInside")
  //- div(ref="cursor" :class="$style.cursor" v-show="isInside" :style="`left: ${cursorLeft}px;`")
</template>

<script lang="ts" setup>
import { get, useElementSize, throttledWatch, useMouseInElement, usePointerSwipe, not } from "@vueuse/core"

const props = defineProps({
  /** length in seconds */
  length: { type: Number, required: true },
})
const { length } = toRefs(props)

const wrapper = ref<HTMLDivElement>()
const notches = ref<HTMLCanvasElement>()
const cursor = ref<HTMLDivElement>()

// const { width, height } = useElementSize(wrapper)

const { elementX, isOutside } = useMouseInElement(wrapper)
const isInside = not(isOutside)

const { distanceX, isSwiping } = usePointerSwipe(wrapper, {
  onSwipe(e: PointerEvent) {
    const speed = get(wrapper)!.clientWidth / get(notches)!.width
    get(wrapper)!.scrollLeft -= distanceX.value * speed / 100
  }
})

const gapSec = ref(10)

const formatToTimeline = (secs: number) => {
  const mins = Math.floor(secs / 60)
  const s = secs - mins * 60
  return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

const drawer = (ctx: CanvasRenderingContext2D) => () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.beginPath()

  for (let i = 0; i < props.length; i++) {
    const x = i * get(gapSec)
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

onMounted(() => {
  const ctx = get(notches)!.getContext("2d")!
  ctx.lineWidth = 2
  ctx.font = "52pt Tahoma"
  const draw = drawer(ctx)

  watchEffect(() => {
    get(cursor)!.style.left = `${get(elementX) + (get(wrapper)?.scrollLeft ?? 0)}px`
  })


  throttledWatch([length, gapSec], () => {
    ctx.canvas.width = get(length) * get(gapSec)
    draw()
  }, { immediate: true, throttle: 250 })


  // throttledWatch([width, height], ([w, h]) => {
  //   const canvas = get(notches)!
  //   canvas.width = w
  //   canvas.height = h
  //   draw()
  // },
  // {
  //   immediate: true,
  //   throttle: 250
  // })

})

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
  cursor: inherit;
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

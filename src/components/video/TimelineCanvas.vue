<template lang="pug">
canvas(ref="canvas" height="28")
</template>

<script lang="ts" setup>
import { formatToTimeline } from "~/misc/utils"
import { Howl } from "howler"

const toast = useToast()

const props = defineProps({
  // frameTimes: { type: Array as PropType<number[]>, required: true },
  wrapper: { type: Object as PropType<Ref<HTMLDivElement>>, required: true },
  duration: { type: Object as PropType<Ref<number>>, required: true },
})

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D
// const zoomLevel = ref(0)
const zoomLevel = inject<Ref<number>>("zoomLevel")!
// const duration = computed(() => props.frameTimes.at(-1) || 0)
const gapSecPx = computed(() => Math.round(get(props.wrapper).clientWidth / get(props.duration)) + get(zoomLevel))

let howl: Howl

const handleZoomScroll = (e: WheelEvent) => {
  e.stopPropagation()
  const newZoomLevel = get(zoomLevel) + Math.sign(e.deltaY)
  if (newZoomLevel < 0 || newZoomLevel > 200) {
    // toast.warning("Zoom level is out of range", { timeout: 1500 })
    if (!howl) {
      howl = new Howl({ src: ["/sounds/249300__suntemple__access-denied.wav"] })
      howl.volume(0.3)
    }
    howl.play()
    return
  }
  set(zoomLevel, newZoomLevel)
}

const setupCanvas = () => {
  ctx = get(canvas)!.getContext("2d")!
  ctx.font = "9pt Verdana"
  ctx.strokeStyle = "#eee"
  ctx.lineWidth = 1
}

const drawTimeSequence = () => {
  // clear canvas
  ctx.canvas.width = get(props.duration) * get(gapSecPx)
  ctx.fillStyle = "#6699aa"
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

  // draw time sequence
  ctx.beginPath()
  for (let i = 0; i < get(props.duration); i++) {
    const x = i * get(gapSecPx)
    const isTensec = i % 10 === 0
    const isMin = i % 60 === 0

    let notchHeight = ctx.canvas.clientHeight - 8
    if (!isTensec) notchHeight -= 5
    if (!isMin) notchHeight -= 5

    ctx.moveTo(x, ctx.canvas.clientHeight - notchHeight)
    ctx.lineTo(x, ctx.canvas.clientHeight)

    if (isTensec || isMin) {
      ctx.fillStyle = isMin ? "#fff" : "#ccc"
      ctx.fillText(formatToTimeline(i), x + 6, 13)
    }
  }
  ctx.stroke()
}

onMounted(() => {
  setupCanvas()
  drawTimeSequence()
})
useEventListener(canvas, "wheel", handleZoomScroll, { passive: true })
throttledWatch([props.duration, gapSecPx], drawTimeSequence, { throttle: 50 })
</script>

<style scoped>
/* canvas {
  top: 0;
  left: 0;
  position: absolute;
} */
</style>

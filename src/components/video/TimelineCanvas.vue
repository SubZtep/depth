<template lang="pug">
canvas(ref="canvas" height="28")
</template>

<script lang="ts" setup>
import type { GeneralEventListener } from "@vueuse/core"
import { formatToTimeline } from "~/misc/utils"
import { useHowler } from "~/packages/Howler"

const toast = useToast()
const player = useHowler(toast.error)

const props = defineProps({
  gapSecPx: { type: Number, required: true },
  wrapper: { type: Object as PropType<Ref<HTMLDivElement>>, required: true },
  duration: { type: Object as PropType<Ref<number>>, required: true },
  zoom: { type: Number, required: true },
})

const zoom = useVModel(props, "zoom")
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D

const handleZoomScroll: GeneralEventListener<WheelEvent> = ({ deltaY }) => {
  const nextZoom = get(zoom) + Math.sign(deltaY)
  if (nextZoom >= 0 && nextZoom < 500) {
    set(zoom, nextZoom)
  } else {
    try {
      player("denied")
    } catch {
      toast.warning("Zoom level is out of range", { timeout: 1300 })
    }
  }
}

const setupCanvas = () => {
  ctx = get(canvas)!.getContext("2d")!
  ctx.font = "9pt Verdana"
  ctx.strokeStyle = "#eee"
  ctx.lineWidth = 1
}

const drawTimeSequence = () => {
  // clear canvas
  ctx.canvas.width = get(props.duration) * props.gapSecPx
  ctx.fillStyle = "#6699aa"
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

  // draw time sequence
  ctx.beginPath()
  for (let i = 0; i < get(props.duration); i++) {
    const x = i * props.gapSecPx
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

onMounted(() => {
  useEventListener(canvas, "wheel", handleZoomScroll, { passive: true })
  throttledWatch([props.duration, () => props.gapSecPx], drawTimeSequence, { throttle: 50 })
})
</script>

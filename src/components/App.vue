<template lang="pug">
.loading(v-show="loading") Loading...

.grid
  Pile(
    v-for="o of piles"
    :opts="o"
    @addFn="fn => void tickFns.add(fn)"
    @delFn="fn => void tickFns.delete(fn)")

canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { not, whenever, get, set, useDevicesList } from "@vueuse/core"
import { useDatGui, playable, webcams } from "../composables/useDatGui"
import { useThreeJs, tickFns } from "../composables/useThreeJs"
import { normalizeDeviceLabel } from "../misc/utils"

useDevicesList({
  requestPermissions: true,
  onUpdated: devices => {
    webcams.clear()
    devices.filter(d => d.kind === "videoinput").map(d => webcams.set(d.deviceId, normalizeDeviceLabel(d.label)))
  },
})
get(playable).push("", "mask.webm", "happy.webm")

const piles = reactive(new Set<PileOpts>())
const { guiEvent, addPileGroup, addPile } = useDatGui()

guiEvent.on(({ delPile }) => {
  delPile && piles.delete(delPile)
})

const canvasRef = ref<HTMLCanvasElement>()
const { onThreeReady, pauseTickLoop, resumeTickLoop } = useThreeJs(canvasRef)
const loading = ref(true)

onThreeReady(() => {
  addPileGroup(() => {
    piles.add(addPile())
  })
  set(loading, false)
})

whenever(loading, pauseTickLoop)
whenever(not(loading), resumeTickLoop)
</script>

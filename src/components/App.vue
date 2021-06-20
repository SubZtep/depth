<template lang="pug">
.loading(v-show="loading") Loading...

.grid
  Pile(
    v-for="id of piles"
    :key="id"
    :pid="id"
    @addFn="fn => pileTickFn.add(fn)"
    @delFn="fn => pileTickFn.delete(fn)")

canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { generateSlug } from "random-word-slugs"
import { useDatGui } from "../composables/useDatGui"
import { not, whenever, set } from "@vueuse/core"
import { useThreeJs } from "../composables/useThreeJs"

const { guiEvent, addPileGroup } = useDatGui()

const piles = reactive(new Set<string>())
const pileTickFn = new Set<() => Promise<void>>()

guiEvent.on(({ delPile }) => {
  delPile && piles.delete(delPile)
})

const canvasRef = ref<HTMLCanvasElement>()
const { onThreeReady, tickLoop, pauseTickLoop, resumeTickLoop } = useThreeJs(canvasRef)
const threeReady = ref(false)

// const loading =  not(and(threeReady)) // not(and(detectorsReady, threeReady, stickmanReady))
const loading = not(threeReady)

onThreeReady(({ scene: _sobj }) => {
  addPileGroup(() => {
    const id = generateSlug()
    piles.add(id)
  })
  // set(scene, sobj)
  set(threeReady, true)
})

tickLoop(async () => {
  for (const fn of pileTickFn) {
    await fn()
  }
})

whenever(loading, pauseTickLoop)
whenever(not(loading), resumeTickLoop)
</script>

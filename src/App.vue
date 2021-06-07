<template lang="pug">
canvas(ref="canvasRef")
video(ref="videoRef" playsinline muted autoplay)
.gui {{ state }}
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { unrefElement, useUserMedia, useDocumentVisibility, set } from "@vueuse/core"
import { useThree } from "./composables/useThree"
import { usePoser } from "./composables/usePoser"
import { Pane } from "tweakpane"

const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

const visibility = useDocumentVisibility()
const { initThree, updater } = useThree()
const { stream, enabled } = useUserMedia({ enabled: false, audioDeviceId: false })
const { initPoser, state, execute } = usePoser()

const PARAMS = {
  webcam: false,
  preview: true,
}

onMounted(async () => {
  const canvas: HTMLCanvasElement = unrefElement(canvasRef)
  const video: HTMLVideoElement = unrefElement(videoRef)

  console.time("three")
  initThree(canvas)
  console.timeEnd("three")

  console.time("poser")
  await initPoser(video)
  console.timeEnd("poser")

  const pane = new Pane()
  const f1 = pane.addFolder({ title: "startup" })
  f1.addInput(PARAMS, "webcam").on("change", async ({ value }) => set(enabled, value))
  f1.addInput(PARAMS, "preview").on("change", ({ value }) => (video.style.visibility = value ? "visible" : "hidden"))

  f1.addSeparator()
  f1.addButton({ title: "get pose" }).on("click", async () => {
    console.time("pose")
    await execute()
    console.timeEnd("pose")
  })

  watch(stream, newStream => (video.srcObject = newStream || null))
  watch(visibility, newVisibility => (enabled.value = PARAMS.webcam && newVisibility === "visible"))
})
</script>

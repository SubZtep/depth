<template lang="pug">
canvas(ref="canvasRef")
video(ref="videoRef" playsinline muted autoplay)
.gui {{ body }}
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { unrefElement, useUserMedia, useDocumentVisibility, set } from "@vueuse/core"
import { useThree } from "./composables/useThree"
import { usePoser } from "./composables/usePoser"
import { usePoseNormalizer } from "./composables/usePoseNormalizer"
import { Pane } from "tweakpane"

const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

const visibility = useDocumentVisibility()
const { initThree, updater, skybox } = useThree()
const { stream, enabled } = useUserMedia({ enabled: false, audioDeviceId: false })
const { initPoser, state, execute } = usePoser()
const { setStreamDimensions, body } = usePoseNormalizer(state)

const PARAMS = {
  webcam: false,
  preview: true,
  skybox: 3,
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
  f1.addInput(PARAMS, "webcam").on("change", ({ value }) => set(enabled, value))
  f1.addInput(PARAMS, "preview").on("change", ({ value }) => (video.style.visibility = value ? "visible" : "hidden"))
  f1.addSeparator()
  f1.addButton({ title: "get pose" }).on("click", async () => {
    console.time("pose")
    await execute()
    console.timeEnd("pose")
  })
  const f2 = pane.addFolder({ title: "look" })
  f2.addInput(PARAMS, "skybox", { min: 1, max: 15, step: 1 }).on("change", ({ value }) => (skybox.value = value))

  watch(stream, newStream => {
    video.srcObject = newStream || null
    if (newStream) {
      setStreamDimensions(newStream.getVideoTracks()[0].getSettings())
    }
  })
  watch(visibility, newVisibility => (enabled.value = PARAMS.webcam && newVisibility === "visible"))
})
</script>

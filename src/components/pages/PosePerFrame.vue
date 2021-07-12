<template lang="pug">
Title Save keypoints frame-by-frame

img(ref="imgRef")
canvas(ref="canvasRef" width="480" height="480")

VideoFileInput(
  v-if="opts.src"
  :src="opts.src"
  @play="setPlaybackRef"
  @pause="playing = false"
  v-visible="opts.showHtmlPlayer")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { onBeforeUnmount, reactive, ref } from "vue"
import { useGui } from "../../packages/datGUI/plugin"
import { VIDEOS } from "../../misc/constants"
import { useToast } from "vue-toastification"
import { set, get, invoke, until, unrefElement } from "@vueuse/core"
// import { useFFmpeg } from "../../packages/FFmpeg/useFFmpeg"
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { useBlazePose } from "../../packages/PoseAI/useBlazePose"

const { progress } = useNProgress()

const threeJsEvent = useThreeJSEventHook()

const toast = useToast()
let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let playing = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(playing, true)
}

const opts = reactive({
  showHtmlPlayer: true,
  src: "",
})

const src = toRef(opts, "src")

const btns = {}

const imgRef = ref<HTMLImageElement>()
const canvasRef = ref<HTMLCanvasElement>()

const gui = useGui()
const folder = gui.addFolder("Estimate frame by frame")
folder.add(opts, "src", ["", ...VIDEOS]).name("File input")
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")
folder.open()

const videoUrl = "http://localhost:3000/videos/yoga2.webm"

// const { ffmpeg } = useFFmpeg()
// onMounted(() => {
const ffmpeg = createFFmpeg({ log: true })
ffmpeg.setProgress(({ ratio }) => set(progress, ratio))
  // toast.info(`FFmpeg ${ffmpeg.isLoaded() ? 'is loaded' : 'not loaded'}`)
  // invoke(async() => {
  //   await ffmpeg.load()
  //   toast.success("FFmpeg loaded")
  // })
// })


invoke(async () => {
  await until(src).toBeTruthy()

  threeJsEvent.trigger({ cmd: "pauseLoop" })
  await ffmpeg.load()

  if (!ffmpeg.isLoaded()) {
    toast.error("FFmpeg load fail")
    threeJsEvent.trigger({ cmd: "resumeLoop" })
    return
  }
  toast.info("FFmpeg loaded")


  const img: HTMLImageElement = unrefElement(imgRef)
  const canvas: HTMLCanvasElement = unrefElement(canvasRef)

  const { results, ready, estimatePose, solution } = useBlazePose(canvasRef)
  await until(ready).toBeTruthy()
  toast.info("Blaze pose loaded")

  // console.log("EEEE", imgRef.value)
  // return

  ffmpeg.FS('writeFile', 'test.webm', await fetchFile(get(src)));
  toast.success(`Video ${get(src)} loaded`)

  await ffmpeg.run(..."-skip_frame nokey -i test.webm -vsync 0 -r 1000 -frame_pts 1 %09d.png".split(" "))
  toast.success(`Video keyframes exported`)


  // @ts-ignores
  const files: string[] = ffmpeg.FS<"readdir">("readdir", ".")

  // solution?.reset()
  // files.filter(filename => filename.endsWith(".png")).forEach(async filename => {
  for (const filename of files.filter(filename => filename.endsWith(".png"))) {
    const data = ffmpeg.FS("readFile", filename)

    const dataView = new DataView(data.buffer, 0, 28) // png only
    const width = dataView.getInt32(16)
    const height = dataView.getInt32(20)

    // canvas.width = width
    // canvas.height = height
    const ctx = canvas.getContext("2d")!

    img.width = width
    img.height = height
    img.onload = function() {
      console.log("LOADED")
      ctx.drawImage(img, 0, 0)
    }
    img.src = URL.createObjectURL(new Blob([data.buffer], { type: "image/png" }))

    console.log("XXX", ctx)
    try {
      ctx.drawImage(img, 0, 0, width, height)

      await nextTick(async () => {
        await estimatePose()

        console.log(filename, results)
      })

      // await estimatePose(canvas)

      // setTimeout(() => {
      //   console.log(filename, results)
      // }, 3000)
    } catch (e) {
      console.log("EEEEE", e)
    }

    // return
    // console.log(filename, [width, height])

    // const imgEl = document.createElement("img")
    // // img.setAttribute("width", String(width))
    // // img.setAttribute("height", String(height))
    // imgEl.width = width
    // imgEl.height = height
    // imgEl.src = URL.createObjectURL(new Blob([data.buffer], { type: "image/png" }))
    // document.querySelector("#world")!.prepend(imgEl)

    // await estimatePose(img)
    // console.log(filename, results)
  }
  // })

  threeJsEvent.trigger({ cmd: "resumeLoop" })
})

onBeforeUnmount(() => {
  ffmpeg.exit()
  gui.removeFolder(folder)
})
</script>

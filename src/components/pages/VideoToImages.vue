<template lang="pug">
Title Video Keyframes

div(:class="$style.grid" ref="gridRef")
  //- template(v-for="img in images")
    component(:is="img")

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
import { set, get, invoke, until, unrefElement, useCssVar } from "@vueuse/core"
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"

const { progress } = useNProgress()

const threeJsEvent = useThreeJSEventHook()


const toast = useToast()
let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let playing = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(playing, true)
}

const gridRef = ref()
const columns = useCssVar("--columns", gridRef)

const opts = reactive({
  showHtmlPlayer: true,
  src: "",
  columns: 3,
})

const src = toRef(opts, "src")

const gui = useGui()
const folder = gui.addFolder("Video keyframes")
folder.add(opts, "src", ["", ...VIDEOS]).name("File input")
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")
folder.add(opts, "columns", 1, 100, 1).name("Columns").onChange(v => set(columns, String(v)))
folder.open()

const ffmpeg = createFFmpeg()
ffmpeg.setProgress(({ ratio }) => set(progress, ratio))


async function createImage(pngData: Uint8Array): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const dataView = new DataView(pngData.buffer, 0, 28) // png only
    const width = dataView.getInt32(16)
    const height = dataView.getInt32(20)
    const img = document.createElement("img")
    img.style.maxWidth = `${width}px`
    img.style.maxHeight = `${height}px`
    img.style.setProperty("--ratio", String(width / height))
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(new Blob([pngData.buffer], { type: "image/png" }))
  })
}


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

  ffmpeg.FS('writeFile', 'test.webm', await fetchFile(get(src)));
  toast.success(`Video ${get(src)} loaded`)

  await ffmpeg.run(..."-skip_frame nokey -i test.webm -vsync 0 -r 1000 -frame_pts 1 %09d.png".split(" "))
  toast.success(`Video keyframes exported`)

  const grid: HTMLElement = unrefElement(gridRef)

  // @ts-ignores
  const files: string[] = ffmpeg.FS<"readdir">("readdir", ".")
  for (const filename of files.filter(filename => filename.endsWith(".png"))) {
    const data = ffmpeg.FS("readFile", filename)
    const img = await createImage(data)
    grid.appendChild(img)
    // get(images).push(img)

    // const dataView = new DataView(data.buffer, 0, 28) // png only
    // const width = dataView.getInt32(16)
    // const height = dataView.getInt32(20)

    // const img = document.createElement("img")
    // img.width = width
    // img.height = height
    // img.onload = function() {
    //   console.log("LOADED")
    //   ctx.drawImage(img, 0, 0)
    // }
    // img.src = URL.createObjectURL(new Blob([data.buffer], { type: "image/png" }))

    // console.log("XXX", ctx)
    // try {
    //   ctx.drawImage(img, 0, 0, width, height)

    //   await nextTick(async () => {
    //     await estimatePose()

    //     console.log(filename, results)
    //   })

    //   // await estimatePose(canvas)

    //   // setTimeout(() => {
    //   //   console.log(filename, results)
    //   // }, 3000)
    // } catch (e) {
    //   console.log("EEEEE", e)
    // }

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
  const grid: HTMLElement = unrefElement(gridRef)
  grid.parentNode?.removeChild(grid)
})
</script>

<style module>
.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
}

.grid img {
  width: 100%;
  aspect-ratio: var(--ratio);
}
</style>

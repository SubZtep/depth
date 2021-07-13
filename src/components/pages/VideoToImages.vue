<template lang="pug">
Title Video Keyframes

div(:class="$style.grid" ref="gridRef")
  img(v-for="src in images" :src="src")

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
import { set, get, whenever, useCssVar, invoke } from "@vueuse/core"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"

const { progress } = useNProgress()
const threeJsEvent = useThreeJSEventHook()

const toast = useToast()
toast.warning("This page eats your memory!")

let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let playing = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(playing, true)
}

const gridRef = ref()

const opts = reactive({
  showHtmlPlayer: true,
  src: "",
  columns: 3,
})

const columns = useCssVar("--columns", gridRef)
set(columns, String(opts.columns))
const src = toRef(opts, "src")

const gui = useGui()
const folder = gui.addFolder("Video keyframes")
folder.add(opts, "src", ["", ...VIDEOS]).name("File input")
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")
folder
  .add(opts, "columns", 1, 100, 1)
  .name("Columns")
  .onChange(v => set(columns, String(v)))
folder.open()

const ffmpeg = createFFmpeg()
ffmpeg.setProgress(({ ratio }) => set(progress, ratio))
await ffmpeg.load()
if (ffmpeg.isLoaded()) {
  toast.info("FFmpeg loaded")
}

const images = ref<string[]>([])

whenever(src, () => {
  let img = get(images).pop()
  while (img) {
    URL.revokeObjectURL(img)
    img = get(images).pop()
  }
  get(images).length = 0

  // imgs.forEach(v => URL.revokeObjectURL(v))
  // imgs.s

  invoke(async () => {
    threeJsEvent.trigger({ cmd: "pauseLoop" })

    if (!ffmpeg.isLoaded()) {
      toast.error("FFmpeg load fail")
      threeJsEvent.trigger({ cmd: "resumeLoop" })
      return
    }

    ffmpeg.FS("writeFile", "test.webm", await fetchFile(get(src)))
    toast.success(`Video ${get(src)} loaded`)

    await ffmpeg.run(..."-skip_frame nokey -i test.webm -vsync 0 -r 1000 -frame_pts 1 %09d.png".split(" "))
    toast.success(`Video keyframes exported`)

    // @ts-ignores
    const files: string[] = ffmpeg.FS<"readdir">("readdir", ".")
    for (const filename of files.filter(filename => filename.endsWith(".png"))) {
      const data = ffmpeg.FS("readFile", filename)
      get(images).push(URL.createObjectURL(new Blob([data.buffer], { type: "image/png" })))
    }

    threeJsEvent.trigger({ cmd: "resumeLoop" })
  })
})

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  ffmpeg.isLoaded() && ffmpeg.exit()

  let img = get(images).pop()
  while (img) {
    URL.revokeObjectURL(img)
    img = get(images).pop()
  }
  get(images).length = 0
})
</script>

<style module>
.grid {
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  overflow: auto;
  position: absolute;
  grid-template-columns: repeat(var(--columns), 1fr);
}
.grid img {
  width: 100%;
}
</style>

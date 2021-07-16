<template lang="pug">
Title Video Keyframes

div(:class="$style.grid" ref="gridRef")
  BlobImage(v-for="filename of imageFilenames" :key="filename" :filename="filename" :FS="ffmpeg.FS")

VideoFileInput(
  v-if="opts.src"
  :src="opts.src"
  @play="setPlaybackRef"
  @pause="playing = false"
  v-visible="opts.showHtmlPlayer")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { useToast } from "vue-toastification"
import { onBeforeUnmount, reactive, ref } from "vue"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { set, get, useCssVar, invoke } from "@vueuse/core"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { useGui } from "../../packages/datGUI/plugin"
import { VIDEOS } from "../../misc/constants"
import { pauseLoop, resumeLoop } from "../../packages/ThreeJS/constants"

const { progress } = useNProgress()
const threeJs = useThreeJSEventHook()
const toast = useToast()

threeJs.trigger(pauseLoop)
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

const ffmpeg = createFFmpeg({ log: true })
ffmpeg.setProgress(({ ratio }) => set(progress, ratio))

const imageFilenames = ref<Set<string>>(new Set())

watch(src, videoSrc => {
  get(imageFilenames).clear()
  if (videoSrc === "") return

  invoke(async () => {
    if (!ffmpeg.isLoaded()) {
      toast.error("FFmpeg load fail")
      return
    }

    ffmpeg.FS("writeFile", "test.webm", await fetchFile(videoSrc))
    toast.success(`Video ${videoSrc} loaded`)

    await ffmpeg.run(..."-skip_frame nokey -i test.webm -vsync 0 -r 1000 -frame_pts 1 %09d.png".split(" "))
    toast.success("Video keyframes exported")

    // @ts-ignore
    const files: string[] = ffmpeg.FS<"readdir">("readdir", "/")
    for (const filename of files.filter(filename => filename.endsWith(".png"))) {
      get(imageFilenames).add(filename)
    }
  })
})

onBeforeUnmount(() => {
  get(imageFilenames).clear()
  gui.removeFolder(folder)

  try {
    ffmpeg.exit()
  } catch (e) {
    console.log("FFmpeg exit", e)
  }

  threeJs.trigger(resumeLoop)
})

await ffmpeg.load()
if (ffmpeg.isLoaded()) {
  toast.info("FFmpeg loaded")
}
</script>

<style module>
.grid {
  top: 0;
  left: 0;
  max-width: 100vw;
  max-height: 100vh;
  display: grid;
  overflow: auto;
  position: absolute;
  grid-template-columns: repeat(var(--columns), 1fr);
}
.grid img {
  width: 100%;
}
</style>

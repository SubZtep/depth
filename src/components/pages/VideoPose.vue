<template lang="pug">
Title Video pose

video(ref="video" :src="opts.src")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { useDevicesList, set, invoke, until, get, useMediaControls } from "@vueuse/core"
import { useBlazePose } from "../../packages/PoseAI/useBlazePose"
import { selectableMedias, selectableVideos, sleep } from "../../misc/utils"
import { useGui } from "../../packages/datGUI/plugin"
import { loopFnPrs, singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { useLocalGroup } from "../../packages/ThreeJS/useLocalGroup"
import { pauseLoop, resumeLoop, doRenderAllFrames, dontRenderAllFrames } from "../../packages/ThreeJS/constants"
import {
  Texture,
  VideoTexture,
  PlaneBufferGeometry,
  Mesh,
  DoubleSide,
  Group,
  Object3D,
  Clock,
  MeshBasicMaterial,
} from "three"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { VIDEOS } from "../../misc/constants"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { useToast } from "vue-toastification"

const threeJs = useThreeJSEventHook()
const toast = useToast()
const gui = useGui()

singleFns.add(({ clock }) => {
  clock.getElapsedTime() < 1 && folder.open()
  threeJs.trigger(pauseLoop)
})

const video = ref()
const opts = reactive({ src: VIDEOS[0], delay: 1000 })
const ctrl = useMediaControls(video, { src: opts.src })

const { results, detectorReady, estimatePose } = await useBlazePose(video)

invoke(async () => {
  await until(detectorReady).toBe(true)
  toast.info("Pose detector ready")
  threeJs.trigger(resumeLoop)
})

const btns = {
  async record() {
    gui.hide()
    threeJs.trigger(pauseLoop)

    const timeStamps: number[] = []

    const { progress, done } = useNProgress()
    const ffmpeg = createFFmpeg({
      log: false,
      logger: ({ message }) => {
        const parts = message.split("pts_time:")
        if (parts.length > 1) timeStamps.push(+parts[1].split(" ")[0])
      },
      progress: ({ ratio }) => set(progress, ratio),
    })

    await ffmpeg.load()
    if (!ffmpeg.isLoaded()) {
      toast.error("FFmpeg load error")
      return
    }

    ffmpeg.FS("writeFile", "test.webm", await fetchFile(opts.src))
    toast.info(`${opts.src} fetched`)
    await ffmpeg.run(..."-i test.webm -vf showinfo -vsync 0 -start_number 0 -f null /dev/null".split(" "))
    toast.info(`${opts.src} parsed for pts data`)
    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }

    useNProgress()
    const pc = 100 / timeStamps.length / 100
    let prog = 0
    set(progress, prog)

    for (const t of timeStamps) {
      set(ctrl.currentTime, t)
      await sleep(opts.delay)
      await estimatePose()
      await sleep(opts.delay)
      if (results.poseLandmarks) {
        // TODO: save
      }
      prog += pc
      set(progress, prog)
    }

    done()
    toast.info("save to db")
    toast.success("estimated done")
    gui.show()
    threeJs.trigger(resumeLoop)
    console.log(timeStamps)
  },
}

const folder = gui.addFolder("🧼☭ Video pose")
folder.add(opts, "src", selectableVideos()).name("File input")
folder.add(opts, "delay", 0, 2000, 100).name("Delay between frames (ms)")
folder.add(btns, "record").name("💾 Estimates")

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})

onErrorCaptured(error => {
  toast.error(error.message)
})
</script>

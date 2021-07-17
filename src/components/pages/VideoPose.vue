<template lang="pug">
Title Video pose

video(ref="video" :src="opts.src")
</template>

<script lang="ts" setup>
import { useDevicesList, set, invoke, until, get, useMediaControls, useEventListener, createEventHook } from "@vueuse/core"
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
import { opening as openingPage } from "../../packages/router/plugin"
import { useFFmpeg } from "../../packages/FFmpeg/useFFmpeg"

/* INIT DEPENDENCIES
*/
const threeJs = useThreeJSEventHook()
const toast = useToast()
const gui = useGui()

/* CREATE HUD GUI
*/
const folder = gui.addFolder("🧼☭ Video pose")
get(openingPage) && folder.open()
folder
  .add(reactive({ src: VIDEOS[0] }), "src", selectableVideos())
  .name("Video file for FFmpeg input")

folder
  .add(btns, "record").name("💾 Estimates")

const video = ref()

const pts = reactive<number[]>([])

const { results, detectorReady, estimatePose } = await useBlazePose(video)

invoke(async () => {
  threeJs.trigger(pauseLoop)

  await until(detectorReady).toBe(true); toast.info("Pose detector ready")
  threeJs.trigger(resumeLoop)
})

const { progress: Nprogress } = useNProgress()

const btns = {
  async record() {
    gui.hide()
    threeJs.trigger(pauseLoop)
    useFFmpeg({
      pts,
      src: toRef(opts, "src"),
      progress: ({ ratio }) => set(Nprogress, ratio)
    })

    // useNProgress()
    // const pc = 100 / timeStamps.length / 100
    // let prog = 0
    // set(progress, prog)

    // for (const t of timeStamps) {
    //   set(ctrl.currentTime, t)
    //   await sleep(opts.delay)
    //   await estimatePose()
    //   await sleep(opts.delay)
    //   if (results.poseLandmarks) {
    //     // TODO: save
    //   }
    //   prog += pc
    //   set(progress, prog)
    // }

    // done()
    // toast.info("save to db")
    // toast.success("estimated done")
    // gui.show()
    // threeJs.trigger(resumeLoop)
    // console.log(timeStamps)
  },
}



async function onEstimatePoseFromNewFrame(): Promise<void> {
  useEventListener<{ target: HTMLVideoElement }>(video, "timeupdate", async ({ target }) => {
    await estimatePose()
  })
}

watch(pts, async keyframeTimestamps => {
  get(video).currentTime = pts.shift()

  console.log("BLOOOOOO")

  // TODO: eventell;e;e

  // const ts = v.slice(-1).pop()!
  // console.log("TESA", [ts, times])

  // // FIXME: rx?
  // if (!estimating) {
  //   estimating = true
  //   get(video).currentTime = ts
  // } else {
  //   times.push(ts)
  // }
})



onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})

onErrorCaptured(error => {
  toast.error(error.message)
})
</script>

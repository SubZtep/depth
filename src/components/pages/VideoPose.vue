<template lang="pug">
Title Video pose

video(ref="video" :src="opts.src")
</template>

<script lang="ts" setup>
import { set, invoke, until, get, whenever, unrefElement } from "@vueuse/core"
import { useBlazePose } from "../../packages/PoseAI/useBlazePose"
import { selectableVideos } from "../../misc/utils"
import { useGui } from "../../packages/datGUI/plugin"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { pauseLoop, resumeLoop } from "../../packages/ThreeJS/constants"
import { VIDEOS } from "../../misc/constants"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useToast } from "vue-toastification"
import { useFFmpeg } from "../../packages/FFmpeg/useFFmpeg"
import { useSupabase } from "../../packages/Supabase/plugin"

const threeJs = useThreeJSEventHook()
const supabase = useSupabase()
const toast = useToast()
const gui = useGui()

const video = ref()
const opts = reactive({ src: VIDEOS[3] })

const { progress } = useNProgress()
const { detectorReady, estimatePose } = useBlazePose(video)

const processingDone = ref(true)
const queue: number[] = []

let videoId: number

threeJs.trigger(pauseLoop)
toast.info("ThreeJS paused")

async function setVideoTime(sec: number): Promise<void> {
  const vel: HTMLVideoElement = unrefElement(video)
  vel.currentTime = sec
  return new Promise(resolve => {
    vel.addEventListener("timeupdate", () => resolve(), { once: true })
  })
}

async function processFrame() {
  if (!get(processingDone)) return
  const pts = queue.shift()
  if (pts === undefined) return
  set(processingDone, false)

  await setVideoTime(pts)
  const pose = await estimatePose()

  const { data, error } = await supabase.from<Supabase.Pose>("pose").upsert({ video_id: videoId, time: pts })
  if (error) {
    console.error("Superbase", error)
    return
  }
  const poseId = data![0].id!

  const { error: e } = await supabase.from<Supabase.Keypoint>("keypoint").upsert(
    pose.poseLandmarks.map(({ x, y, z, visibility }, index) => ({
      pose_id: poseId,
      index,
      x,
      y,
      z,
      visibility,
    })),
    { returning: "minimal" }
  )
  if (e) {
    console.error("Superbase", e)
    return
  }

  set(processingDone, true)
}

const btns = {
  async record() {
    // gui.hide()

    const { data, error } = await supabase.from<Supabase.Video>("video").upsert({ filename: "xy", length: 0, width: 0, height: 0 })
    if (error) {
      console.error("Superbase", error)
      return
    }
    videoId = data![0].id!

    useFFmpeg({
      src: toRef(opts, "src"),
      progress: ({ ratio }) => set(progress, ratio),
      logger: toast,
      onTimestamp: ts => {
        queue.push(ts)
        if (get(processingDone)) {
          processFrame()
        }
      },
      onDone: () => toast.success("FFmpeg Done"),
    })

    whenever(processingDone, processFrame)
  },
}

const folder = gui.addFolder("🧼☭ Video pose")
folder.add(opts, "src", selectableVideos()).name("File input")

invoke(async () => {
  await until(detectorReady).toBe(true)
  toast.info("Pose detector ready")
  folder.add(btns, "record").name("💾 Estimates")
  folder.open()
})

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})

onErrorCaptured(error => {
  toast.error(error.message)
})
</script>

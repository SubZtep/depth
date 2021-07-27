<template lang="pug">
Title Video pose

.debug {{state}}

video(
  ref="video"
  :src="state.src"
  v-dbvideo="id => state.videoId = id")
</template>

<script lang="ts" setup>
import { set, get, whenever, unrefElement } from "@vueuse/core"
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
import { toRef } from "vue"
import { PoseType } from "../../packages/Supabase/dbqueries"

const toast = useToast()
const { progress } = useNProgress()
const { db } = useSupabase({ logger: toast })
const threeJs = useThreeJSEventHook()
threeJs.trigger(pauseLoop)

interface State {
  /** Selected video file source path */
  src: string

  /** Selected video id in database */
  videoId?: number
}

const state = reactive<State>({
  src: VIDEOS[3],
  videoId: undefined,
})

const gui = useGui()
const folder = gui.addFolder("🧼☭ Video pose")
folder.add(state, "src", selectableVideos()).name("File input")

const video = ref()
const { estimatePose } = useBlazePose({
  video,
  onDetectorReady: () => {
    folder.add(btns, "record").name("💾 Estimates")
    folder.open()
  }
})

async function updateVideoTime(seekToSec: number): Promise<void> {
  const vel: HTMLVideoElement = unrefElement(video)
  vel.currentTime = seekToSec
  return new Promise(resolve => {
    vel.addEventListener("timeupdate", () => resolve(), { once: true })
  })
}

const processingDone = ref(false)
const queue: number[] = []

async function processFrame() {
  if (!get(processingDone)) return

  const pts = queue.shift()
  if (pts === undefined) return
  set(processingDone, false)

  await updateVideoTime(pts)
  const pose = await estimatePose()

  const rawPoseId = await db.addPose({ video_id: state.videoId!, time: pts, type: PoseType.Raw })
  db.addKeypoints(pose.poseWorldLandmarks.map((kp, index) => ({ pose_id: rawPoseId, index, ...kp })))

  const normPoseId = await db.addPose({ video_id: state.videoId!, time: pts, type: PoseType.Normalized })
  db.addKeypoints(pose.poseLandmarks.map((kp, index) => ({ pose_id: normPoseId, index, ...kp })))

  set(processingDone, true)
}

const btns = {
  async record() {
    if (!state.src) return toast.error("No video selected")
    if (!state.videoId) return toast.error("Active video is not in db")

    useFFmpeg({
      src: toRef(state, "src"),
      progress: ({ ratio }) => set(progress, ratio),
      logger: toast,
      onTimestamp: ts => queue.push(ts),
      onStarted: () => set(processingDone, true),
      onDone: () => toast.success("FFmpeg Done"),
    })

    whenever(processingDone, processFrame)
  },
}

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})

onErrorCaptured(error => {
  toast.error(`Captured: ${error.message}`)
})
</script>

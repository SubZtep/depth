<template lang="pug">
Title Video pose

.debug {{state}}

video(
  ref="video"
  :src="state.src"
  v-dbvideo="id => state.videoId = id")
</template>

<script lang="ts" setup>
import type { Results } from "../../packages/PoseAI"
import { set, get, whenever } from "@vueuse/core"
import { useToast } from "vue-toastification"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "../../packages/ThreeJS"
import { useSupabase } from "../../packages/Supabase"
import { useBlazePose, PoseType } from "../../packages/PoseAI"
import { useFFmpeg } from "../../packages/FFmpeg"
import { useGui } from "../../packages/datGUI"
import { selectableVideos, updateVideoTime } from "../../misc/utils"
import { VIDEOS } from "../../misc/constants"

const toast = useToast()
const { progress } = useNProgress()
const { db } = useSupabase({ logger: toast })
const threeJs = useThreeJSEventHook()
threeJs.trigger(pauseLoop)
toast.info("3D background paused due to heavy calculations on this page")

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
  },
  options: {
    modelComplexity: 2,
  },
})

// async function updateVideoTime(seekToSec: number): Promise<void> {
//   const el: HTMLVideoElement = unrefElement(video)
//   el.currentTime = seekToSec
//   return new Promise(resolve => {
//     el.addEventListener("timeupdate", () => resolve(), { once: true })
//   })
// }

const processingDone = ref(false)
const frameTimesQueue: number[] = []

async function processFrame() {
  if (!get(processingDone)) return

  const pts = frameTimesQueue.shift()
  if (pts === undefined) {
    toast.success("All done, poses are in db")
    return
  }
  set(processingDone, false)

  await updateVideoTime(video, pts)

  let pose: Results
  try {
    pose = await estimatePose()
  } catch (e) {
    toast.error(e.message)
    set(processingDone, true)
    return
  }

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
      onTimestamp: ts => frameTimesQueue.push(ts),
      onStarted: () => set(processingDone, true),
      onDone: () => toast.success("FFmpeg Done"),
    })

    whenever(processingDone, processFrame)
  },
}

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
  toast.info("3D background resumed")
})

onErrorCaptured(error => {
  toast.error(`Captured: ${error.message}`)
})
</script>

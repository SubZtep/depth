import { Group } from "three"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { ref, onBeforeUnmount, toRef, watchEffect } from "vue"
import { unrefElement, useEventListener, get, set, until, tryOnMounted } from "@vueuse/core"
import { scene, renderer, tickFns } from "../composables/useThreeJs"
import { useScenePlayer } from "../composables/useScenePlayer"
import { usePose } from "../composables/usePose"
import { Stickman } from "../models/stickman"
import { div } from "../misc/utils"

export function useInputGroup<T extends InputGroup>(opts: T, videoRef: Ref<HTMLVideoElement>) {
  const { estimatePoses, detectorReady } = usePose()
  const { start, done, progress } = useNProgress(0.3)
  start()

  const videoWidth = ref(640)
  const videoHeight = ref(480)
  const width = toRef(opts, "width")
  const scale = div(width, videoWidth)
  const ratio = div(videoWidth, videoHeight)

  const root = new Group()
  useScenePlayer(videoRef, root, opts, ratio)
  let stickman: Stickman

  const tick: PrFn = async () => {
    let pose: Pose
    try {
      pose = await estimatePoses(unrefElement(videoRef))
    } catch (e) {
      console.error(`tick: ${e.message}`)
      return
    }
    stickman.updateJoints(pose.keypoints)
    stickman.updateLines(pose.keypoints)
  }

  useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
    console.log("JUGUU 1")
    set(videoWidth, target.videoWidth)
    set(videoHeight, target.videoWidth)
    if (!target.isPlaying && get(detectorReady)) {
      target.play()
    }
  })

  tryOnMounted(async () => {
    console.log("Y%RT")
    // start(0.3)
    set(progress, 0.6)
    await until(detectorReady).toBeTruthy()
    done()
    // @ts-ignore
    console.log("FFF", opts)
    const video: HTMLVideoElement = unrefElement(videoRef)
    stickman = new Stickman(root, videoWidth, videoHeight, scale)
    stickman.zMulti = toRef(opts, "zMulti")
    scene.add(root)
    console.log("JUGUU 2")
    // opts.f.open()
    // opts.open()

    console.log([video.readyState, video.HAVE_CURRENT_DATA, video.isPlaying])
    if (video.readyState >= video.HAVE_CURRENT_DATA && !video.isPlaying) {
      video.play()
    }

    watchEffect(async () => {
      root.position.set(opts.position.x, opts.position.y, opts.position.z)
    })

    tickFns.add(tick)
  })

  onBeforeUnmount(() => {
    tickFns.delete(tick)
    scene.remove(root)
    stickman.dispose()
    renderer?.renderLists.dispose()
    // TODO: clean up all children
  })
}

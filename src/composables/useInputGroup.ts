import { Group } from "three"
import { ref, onMounted, onBeforeUnmount, toRef, watchEffect } from "vue"
import { unrefElement, useEventListener, get, set, until } from "@vueuse/core"
import { scene, renderer, tickFns } from "../composables/useThreeJs"
import { useScenePlayer } from "../composables/useScenePlayer"
import { usePose } from "../composables/usePose"
import { Stickman } from "../models/stickman"
import { div } from "../misc/utils"

export function useInputGroup<T extends InputGroup>(opts: T, videoRef: Ref<HTMLVideoElement>) {
  const { estimatePoses, detectorReady } = usePose()

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
    set(videoWidth, target.videoWidth)
    set(videoHeight, target.videoWidth)
    if (!target.isPlaying && get(detectorReady)) {
      target.play()
    }
  })

  onMounted(async () => {
    await until(detectorReady).toBeTruthy()
    const video: HTMLVideoElement = unrefElement(videoRef)
    stickman = new Stickman(root, videoWidth, videoHeight, scale)
    stickman.zMulti = toRef(opts, "zMulti")
    scene.add(root)
    opts.f.open()

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

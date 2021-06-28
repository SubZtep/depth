import { Group } from "three"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { onMounted, ref, onBeforeUnmount, toRef, watchEffect } from "vue"
import { unrefElement, useEventListener, get, set, until, tryOnMounted, or, not } from "@vueuse/core"
import { scene, renderer, tickFns } from "../composables/useThreeJs"
import { useScenePlayer } from "../composables/useScenePlayer"
import { usePose } from "../composables/usePose"
import { Stickman } from "../models/stickman"
import { useGlobalState } from "../store"
import { div } from "../misc/utils"

export function useInputGroup<T extends InputGroup>(opts: T, videoRef: Ref<HTMLVideoElement>) {
  const state = useGlobalState()
  let estimatePoses: (video: HTMLVideoElement) => Promise<any>
  let detectorReady: Ref<boolean> = ref(false)
  const poseDetection = toRef(get(state), "poseDetection")

  if (get(poseDetection)) {
    const p = usePose()
    estimatePoses = p.estimatePoses
    set(detectorReady, get(p.detectorReady))
  }

  const { progress, done } = useNProgress()

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
    if (!target.isPlaying && (!get(poseDetection) || get(detectorReady))) {
      console.log("PPP2")
      target.play()
    }
  })

  onMounted(async () => {
    set(progress, 0.6)
    await until(or(not(poseDetection), detectorReady)).toBeTruthy()
    done()
    const video: HTMLVideoElement = unrefElement(videoRef)
    opts.open()

    if (video.readyState >= video.HAVE_CURRENT_DATA && !video.isPlaying) {
      video.play()
    }

    watchEffect(async () => {
      root.position.set(opts.position.x, opts.position.y, opts.position.z)
    })

    if (get(poseDetection)) {
      stickman = new Stickman(root, videoWidth, videoHeight, scale)
      stickman.zMulti = toRef(opts, "zMulti")
      tickFns.add(tick)
    }
    scene.add(root)
  })

  onBeforeUnmount(() => {
    tickFns.delete(tick)
    scene.remove(root)
    stickman?.dispose()
    renderer?.renderLists.dispose()
    // TODO: clean up all children
  })
}

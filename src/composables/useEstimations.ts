import type { Pose } from "@tensorflow-models/pose-detection"
import type { Ref } from "vue"
import { ref, watch, unref } from "vue"
import { set, until } from "@vueuse/core"
import { Stickman } from "../models/stickman"
import { useGlobalState } from "../store"

interface EstimationsProps {
  threeReady: Ref<boolean>
  scene: Ref<THREE.Scene | undefined>
}

export function useEstimations({ threeReady, scene }: EstimationsProps) {
  const stickmans = new Map<string, Stickman>()
  const { videos } = useGlobalState()
  const stickmanReady = ref(false)

  const setStickmanPose = (id: string, pose: Pose) => {
    stickmans.get(id)!.update(pose)
  }

  const setStickmanVideo = (el: HTMLVideoElement) => {
    stickmans.get(el.id)!.setVideo(el)
  }

  watch(
    () => videos.map(v => v.visibleObj),
    () => {
      videos.forEach(({ id, visibleObj}) => {
        stickmans.get(id)!.videoPlayer!.visible = visibleObj
      })
    }
  )

  watch(
    () => videos.map(v => v.model),
    async () => {
      set(stickmanReady, false)
      await until(threeReady).toBeTruthy()

      for (const { id, model } of videos) {
        let stickman: Stickman
        if (stickmans.has(id)) {
          stickman = stickmans.get(id)!
        } else {
          stickman = new Stickman(id, unref(scene)!)
          stickmans.set(id, stickman)
        }
        stickman.setKeypoints(model)
      }

      set(stickmanReady, true)
    },
    { immediate: true }
  )

  return {
    stickmanReady,
    setStickmanPose,
    setStickmanVideo,
  }
}

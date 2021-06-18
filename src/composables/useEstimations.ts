import type { Pose } from "@tensorflow-models/pose-detection"
import type { Ref } from "vue"
import { ref, watch, unref } from "vue"
import { set, until } from "@vueuse/core"
import { Stickman } from "../models/stickman"
import { useGlobalState } from "../store"
import { difference } from "../misc/utils"

interface EstimationsProps {
  threeReady: Ref<boolean>
  scene: Ref<THREE.Scene | undefined>
}

export function useEstimations({ threeReady, scene }: EstimationsProps) {
  const stickmans = new Map<string, Stickman>()
  const { videos } = useGlobalState()
  const stickmanReady = ref(false)

  const setPose = (id: string, pose: Pose) => {
    stickmans.get(id)?.update(pose)
  }

  const setVideo = (el: HTMLVideoElement) => {
    stickmans.get(el.id)?.setVideo(el)
  }

  watch(
    videos,
    async newVideos => {
      set(stickmanReady, false)
      await until(threeReady).toBeTruthy()

      const oldIds = Array.from(stickmans.keys())

      if (newVideos.length !== oldIds.length) {
        const newIds = newVideos.map(v => v.id)
        const added = difference<string>(newIds, oldIds)
        const removed = difference<string>(oldIds, newIds)
        added.forEach(id => {
          const stickman = new Stickman(id, unref(scene)!)
          stickmans.set(id, stickman)
        })
        removed.forEach(_id => {
          // TODO: remove
        })
      }

      newVideos.forEach(v => {
        const stickman = stickmans.get(v.id)
        if (stickman === undefined) {
          throw new Error(`unable to find ${v.id} stickman`)
        }
        if (stickman.videoPlayer && stickman.videoPlayer.visible !== v.visibleObj) {
          stickman.videoPlayer.visible = v.visibleObj
        }
        const pos = stickman.rootGroup.position
        if (pos.x !== v.objX || pos.y !== v.objY || pos.z !== v.objZ) {
          stickman.rootGroup.position.set(v.objX, v.objY, v.objZ)
        }
        
        console.log("SCALE", stickman.videoPlayer?.scale)

        stickman.assortJoints()
      })

      set(stickmanReady, true)
    },
    {
      immediate: true,
      deep: true,
    }
  )

  return {
    stickmanReady,
    setPose,
    setVideo,
  }
}

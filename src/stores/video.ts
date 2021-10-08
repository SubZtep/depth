import { defineStore } from "pinia"
import settings from "~/../SETTINGS.toml"
import { useSupabase } from "~/packages/Supabase"

export interface VideoStatePose {
  ts: number
  pose_raw?: LandmarkList
  pose_normalized: NormalizedLandmarkList
}

export const useVideoStore = defineStore("video", {
  state: () => ({
    id: undefined as number | undefined,
    src: undefined as string | undefined,
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    duration: undefined as number | undefined,
    keyframes: undefined as number[] | undefined,
    poses: undefined as VideoStatePose[] | undefined,
  }),
  getters: {
    hasId: state => state.id !== undefined,
    hasKeyframes: state => state.keyframes !== undefined && state.keyframes.length > 0,
    hasPoses: state => state.poses !== undefined && state.poses.length > 0,
    isProcessable: state => state.src !== undefined && state.width !== undefined && state.height !== undefined && state.duration !== undefined,
  },
  actions: {
    async replace(obj: Db.Video) {
      this.$reset()
      const { db } = useSupabase()

      let id = await db.getVideoId(obj)
      let keyframes: number[] | undefined = undefined
      let poses: VideoStatePose[] | undefined = undefined

      if (id) {
        keyframes = await db.getKeyframes(id)
        poses = await db.getPoses(id)
      } else {
        id = await db.insertVideo(obj)
      }

      this.$patch({
        id,
        ...obj,
        keyframes,
        poses,
      })
    },
  },
})

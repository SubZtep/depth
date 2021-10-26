import type { StoreDefinition } from "pinia"
import { defineStore } from "pinia"
import { useSupabase } from "@depth/supabase"
import type { LandmarkList, NormalizedLandmarkList, Results } from "@depth/mediapipe"
import DbQueries from "../misc/dbqueries"

export interface VideoStatePose {
  ts: number
  pose_raw?: LandmarkList
  pose_normalized: NormalizedLandmarkList
}

export const useVideoStore: StoreDefinition = defineStore("video", {
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
    hasSrc: state => state.src !== undefined,
    hasKeyframes: state => state.keyframes !== undefined && state.keyframes.length > 0,
    hasPoses: state => state.poses !== undefined && state.poses.length > 0,
    closestPose: state => (ts: number) => {
      if (!state.poses) throw new Error("No poses")
      return state.poses.reduce((prev: VideoStatePose, curr: VideoStatePose) =>
        Math.abs(curr.ts - ts) < Math.abs(prev.ts - ts) ? curr : prev
      )
    },
  },

  actions: {
    async replace(obj: Db.Video) {
      this.$reset()
      if (!obj) return

      const { supabase } = useSupabase()
      const db = new DbQueries(supabase, console)

      let keyframes: number[] | undefined = undefined
      let poses: VideoStatePose[] | undefined = undefined
      let id = await db.getVideoId(obj)

      if (id) {
        keyframes = await db.getKeyframes(id)
        poses = await db.getPoses(id)
      } else {
        id = await db.insertVideo(obj)
      }

      this.$patch({
        ...obj,
        id,
        keyframes,
        poses,
      })
    },

    async setKeyframes(keyframes?: number[]) {
      if (!this.id) throw new Error("Unable to set keyframes without video id")
      if (!keyframes) throw new Error("Unable to set keyframes without keyframes")
      const { supabase } = useSupabase()
      const db = new DbQueries(supabase, console)
      await db.insertKeyframes(this.id, keyframes)
      this.keyframes = keyframes
    },

    async setPoses(poses: VideoStatePose[]) {
      if (!this.id) throw new Error("Unable to set poses without video id")
      const { supabase } = useSupabase()
      const db = new DbQueries(supabase, console)
      await db.insertPoses(this.id, poses)
      this.poses = poses
    },

    async addPose(ts: number, results: Results) {
      if (!this.id) throw new Error("Unable to set poses without video id")
      const { supabase } = useSupabase()
      const db = new DbQueries(supabase, console)
      await db.insertPose(this.id, ts, results)
      if (this.poses === undefined) this.poses = []
      this.poses.push({
        ts,
        pose_raw: results.poseLandmarks,
        pose_normalized: results.poseWorldLandmarks,
      })
    },
  },
})

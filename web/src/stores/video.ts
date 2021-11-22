import { defineStore, StoreDefinition } from "pinia"
import { useSupabase } from "@depth/supabase"
import type { Results } from "@depth/mediapipe"
import DatabaseQueries from "../misc/dbqueries"

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
      // eslint-disable-next-line unicorn/no-array-reduce
      return state.poses.reduce((previous: VideoStatePose, current: VideoStatePose) =>
        Math.abs(current.ts - ts) < Math.abs(previous.ts - ts) ? current : previous
      )
    },
  },

  actions: {
    async replace(object: Db.Video) {
      this.$reset()
      if (!object) return

      const { supabase } = useSupabase()
      const database = new DatabaseQueries(supabase, console)

      let keyframes: number[] | undefined
      let poses: VideoStatePose[] | undefined
      let id = await database.getVideoId(object)

      if (id) {
        keyframes = await database.getKeyframes(id)
        poses = await database.getPoses(id)
      } else {
        id = await database.insertVideo(object)
      }

      this.$patch({
        ...object,
        id,
        keyframes,
        poses,
      })
    },

    async setKeyframes(keyframes?: number[]) {
      if (!this.id) throw new Error("Unable to set keyframes without video id")
      if (!keyframes) throw new Error("Unable to set keyframes without keyframes")
      const { supabase } = useSupabase()
      const database = new DatabaseQueries(supabase, console)
      await database.insertKeyframes(this.id, keyframes)
      this.keyframes = keyframes
    },

    async setPoses(poses: VideoStatePose[]) {
      if (!this.id) throw new Error("Unable to set poses without video id")
      const { supabase } = useSupabase()
      const database = new DatabaseQueries(supabase, console)
      await database.insertPoses(this.id, poses)
      this.poses = poses
    },

    async addPose(ts: number, results: Results) {
      if (!this.id) throw new Error("Unable to set poses without video id")
      const { supabase } = useSupabase()
      const database = new DatabaseQueries(supabase, console)
      await database.insertPose(this.id, ts, results)
      if (this.poses === undefined) this.poses = []
      this.poses.push({
        ts,
        pose_raw: results.poseLandmarks,
        pose_normalized: results.poseWorldLandmarks,
      })
    },
  },
})

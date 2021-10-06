import type { LandmarkList, NormalizedLandmarkList } from "public/pose"
import { defineStore } from "pinia"
import settings from "~/../SETTINGS.toml"

export interface VideoStatePose {
  ts: number
  pose_raw?: LandmarkList
  pose_normalized: NormalizedLandmarkList
}

export interface VideoState {
  /** Database ID */
  id?: number

  /** Video source url */
  src?: string

  /** Video width in pixels  */
  width?: number

  /** Video height in pixels  */
  height?: number

  /** Video length */
  duration?: number

  /** video keyframe timestamps */
  keyframes?: number[]

  poses?: VideoStatePose[]
}

export const useVideoStore = defineStore<"video", VideoState>("video", {
  state: () => ({
    src: settings.video?.clips?.[0] ?? undefined,
  }),
})

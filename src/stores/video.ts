import { defineStore } from "pinia"
import settings from "~/../SETTINGS.toml"

export interface VideoStatePose {
  ts: number
  pose_raw?: LandmarkList
  pose_normalized: NormalizedLandmarkList
}

// export interface VideoState {
//   /** Database ID */
//   id: number | undefined

//   /** Video source url */
//   src: string | undefined

//   /** Video width in pixels  */
//   width: number | undefined

//   /** Video height in pixels  */
//   height: number | undefined

//   /** Video length */
//   duration: number | undefined

//   /** video keyframe timestamps */
//   keyframes: number[] | undefined

//   poses: VideoStatePose[] | undefined
// }

// export const useVideoStore = defineStore<"video", VideoState>("video", {
export const useVideoStore = defineStore("video", {
  state: () => ({
    id: undefined as number | undefined,
    src: settings.video?.clips?.[0] ?? (undefined as string | undefined),
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
  // actions: {
  //   reset() {
  //     this.id = undefined
  //     this.src = undefined
  //     this.width = undefined
  //     this.height = undefined
  //     this.duration = undefined
  //     this.keyframes = undefined
  //     this.poses = undefined
  //   },
  // },
})

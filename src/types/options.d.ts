/** there are defaults */
interface PoserOptions {
  /** delay ms between frames, zero request animation frames */
  interval?: number
  /** filter to keypoint names */
  focusJoints?: Joint[]
  /** minimum score to reach for update */
  minScore?: number
}

// interface SkeletonOptions {
//   // body: import("vue").ComputedRef<JointPoints>
//   updater: Set<(delta: number) => void>
// }

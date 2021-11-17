interface VideoStatePose {
  ts: number
  pose_raw?: LandmarkList
  pose_normalized: NormalizedLandmarkList
}

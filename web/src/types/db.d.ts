namespace Db {
  abstract interface SerialId {
    readonly id?: number
  }

  abstract interface TriggerInserted {
    readonly inserted_at?: string
  }

  abstract interface TriggerUpdated {
    readonly inserted_at?: string
  }

  interface Video extends SerialId, TriggerInserted, TriggerUpdated {
    src: string
    duration: number
    width: number
    height: number
  }

  interface Keyframe {
    video_id: number
    ts: number
  }

  interface Pose extends SerialId, TriggerInserted, TriggerUpdated {
    video_id: number
    ts: number
    pose_raw?: any
    pose_normalized: any
    // pose_raw?: import("public/pose").LandmarkList
    // pose_normalized: import("public/pose").NormalizedLandmarkList
  }
}

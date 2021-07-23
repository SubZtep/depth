interface SupabasePluginOptions {
  url: string
  key: string
  options?: import("@supabase/supabase-js").SupabaseClientOptions
}

namespace Supabase {
  abstract interface SerialId {
    readonly id?: number
  }

  abstract interface TriggerInserted {
    readonly inserted_at?: string
  }

  abstract interface TriggerUpdated {
    readonly inserted_at?: string
  }

  enum PoseType {
    Raw = 0,
    Normalized = 1
  }

  interface Video extends SerialId, TriggerInserted, TriggerUpdated {
    filename: string
    length: number
    width: number
    height: number
  }

  interface Pose extends SerialId, TriggerInserted, TriggerUpdated {
    video_id: number
    time: number
    type: PoseType
  }

  interface Keypoint {
    pose_id: number
    index: number
    x: number
    y: number
    z: number
    visibility: number
  }
}

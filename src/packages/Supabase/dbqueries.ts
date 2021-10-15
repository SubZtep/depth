import type { VideoStatePose } from "~/stores/video"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Results } from "~/packages/PoseAI"

export default class DbQueries {
  #client: SupabaseClient
  #logger?: Logger

  constructor(client: SupabaseClient, logger?: Logger) {
    this.#client = client
    this.#logger = logger
  }

  async getVideos(): Promise<Db.Video[] | undefined> {
    const {
      data,
      error,
    } = await this
      .#client
      .from<Db.Video>("video")
      .select("id, src, duration, width, height")

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    return data || undefined
  }

  async getVideoId({ src, duration, width, height }: Db.Video): Promise<number | undefined> {
    const {
      data,
      error,
    } = await this
      .#client
      .from<Db.Video>("video")
      .select("id")
      .match({ src, duration, width, height })
      .limit(1)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    return data?.[0]?.id
  }

  async insertVideo(obj: Db.Video): Promise<number> {
    const {
      data,
      error,
    } = await this
      .#client
      .from<Db.Video>("video")
      .upsert(obj)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == null || data.length === 0 || data[0].id == null) {
      const msg = "Insert video error"
      this.#logger?.error(msg)
      return Promise.reject(msg)
    }

    return data[0].id
  }

  async getKeyframes(videoId: number): Promise<number[] | undefined> {
    const {
      data,
      error,
    } = await this
      .#client
      .from<Db.Keyframe>("keyframe")
      .select("ts")
      .eq("video_id", videoId)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == null || data.length === 0) {
      return undefined
    }

    return data.map(({ ts }) => ts)
  }

  async insertKeyframes(videoId: number, timestamps: number[]): Promise<void> {
    const obj: Db.Keyframe[] = timestamps.map(ts => ({ video_id: videoId, ts }))

    const {
      error
    } = await this
      .#client
      .from<Db.Keyframe>("keyframe")
      .upsert(obj, { returning: "minimal" })

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }
  }

  async getPoses(videoId: number): Promise<Db.Pose[] | undefined> {
    const {
      data,
      error,
    } = await this
      .#client
      .from<Db.Pose>("pose")
      .select("ts, pose_normalized")
      .eq("video_id", videoId)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == null || data.length === 0) {
      return undefined
    }

    return data
  }

  async insertPoses(videoId: number, poses: VideoStatePose[]): Promise<void> {
    const obj: Db.Pose[] = poses.map(({ ts, pose_normalized }) => ({ video_id: videoId, ts, pose_normalized }))

    const {
      error
    } = await this
      .#client
      .from<Db.Pose>("pose")
      .upsert(obj, { returning: "minimal" })

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }
  }

  // async insertPose(videoId: number, pose: VideoStatePose): Promise<void> {
  async insertPose(videoId: number, ts: number, results: Results): Promise<void> {
    const obj: Db.Pose = { video_id: videoId, ts, pose_normalized: results.poseWorldLandmarks }

    const {
      error
    } = await this
      .#client
      .from<Db.Pose>("pose")
      .upsert(obj, { returning: "minimal" })

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }
  }
}

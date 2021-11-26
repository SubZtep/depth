// import type { SupabaseClient } from "@depth/supabase"
// import type { Results } from "@depth/mediapipe"
type SupabaseClient = any
type Results = any

type Logger = any

export default class DatabaseQueries {
  #client: SupabaseClient
  #logger?: Logger

  constructor(client: SupabaseClient, logger?: Logger) {
    this.#client = client
    this.#logger = logger
  }

  async getVideos(): Promise<Db.Video[] | undefined> {
    const { data, error } = await this.#client.from<Db.Video>("video").select("id, src, duration, width, height")

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    return data || undefined
  }

  async getVideoId({ src, duration, width, height }: Db.Video): Promise<number | undefined> {
    const { data, error } = await this.#client
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

  async insertVideo(object: Db.Video): Promise<number> {
    const { data, error } = await this.#client.from<Db.Video>("video").upsert(object)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == undefined || data.length === 0 || data[0].id == undefined) {
      const message = "Insert video error"
      this.#logger?.error(message)
      return Promise.reject(message)
    }

    return data[0].id
  }

  async getKeyframes(videoId: number): Promise<number[] | undefined> {
    const { data, error } = await this.#client.from<Db.Keyframe>("keyframe").select("ts").eq("video_id", videoId)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == undefined || data.length === 0) {
      return undefined
    }

    return data.map(({ ts }) => ts)
  }

  async insertKeyframes(videoId: number, timestamps: number[]): Promise<void> {
    const object: Db.Keyframe[] = timestamps.map(ts => ({ video_id: videoId, ts }))
    const { error } = await this.#client.from<Db.Keyframe>("keyframe").upsert(object, { returning: "minimal" })

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }
  }

  async getPoses(videoId: number): Promise<Db.Pose[] | undefined> {
    const { data, error } = await this.#client
      .from<Db.Pose>("pose")
      .select("ts, pose_normalized")
      .eq("video_id", videoId)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == undefined || data.length === 0) {
      return undefined
    }

    return data
  }

  async insertPoses(videoId: number, poses: VideoStatePose[]): Promise<void> {
    const object: Db.Pose[] = poses.map(({ ts, pose_normalized }) => ({ video_id: videoId, ts, pose_normalized }))
    const { error } = await this.#client.from<Db.Pose>("pose").upsert(object, { returning: "minimal" })

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }
  }

  async insertPose(videoId: number, ts: number, results: Results): Promise<void> {
    const object: Db.Pose = { video_id: videoId, ts, pose_normalized: results.poseWorldLandmarks }
    const { error } = await this.#client.from<Db.Pose>("pose").upsert(object, { returning: "minimal" })

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }
  }

  async getAllMetaSnails(playerUuid: string): Promise<MetaSnail[] | undefined> {
    const { data, error } = await this.#client.from("metasnail").select("*").neq("uuid", playerUuid)

    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (!data) {
      return undefined
    }

    return data
  }
}

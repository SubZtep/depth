import type { SupabaseClient } from "@supabase/supabase-js"

export enum PoseType {
  Raw = 0,
  Normalized = 1,
}

export default class DbQueries {
  #client: SupabaseClient
  #logger?: Logger

  constructor(client: SupabaseClient, logger?: Logger) {
    this.#client = client
    this.#logger = logger
  }

  async hasVideo(filename: string): Promise<number | undefined> {
    const { data, error } = await this.#client.from<Video>("video").select("id").eq("filename", filename).limit(1)
    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == null || data.length === 0) {
      // this.#logger.info(`File doesn't exists in db ${filename}`)
      return undefined
    }

    // this.#logger.info(`File exists in db ${filename}`)
    return data[0].id
  }

  async addVideo(obj: Video): Promise<number> {
    const { data, error } = await this.#client.from<Video>("video").upsert(obj)
    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == null || data.length === 0) {
      const msg = `Unable to add video to db ${obj.filename}`
      this.#logger?.error(msg)
      return Promise.reject(msg)
    }

    // this.#logger.info(`File added ${obj.filename}`)
    return data[0].id!
  }

  async addPose(obj: Pose): Promise<number> {
    const { data, error } = await this.#client.from<Pose>("pose").upsert(obj)
    if (error) {
      this.#logger?.error(error.message)
      return Promise.reject(error.message)
    }

    if (data == null || data.length === 0) {
      const msg = `Unable to add pose to db ${obj.time}`
      this.#logger?.error(msg)
      return Promise.reject(msg)
    }

    return data[0].id!
  }

  async addKeypoints(obj: Keypoint[]): Promise<void> {
    const { error } = await this.#client.from<Keypoint>("keypoint").upsert(obj, { returning: "minimal" })
    if (error) {
      // this.#logger.error(error.message)
      return Promise.reject(error.message)
    }
    // this.#logger.info(`${obj.length} Keypoints added`)
  }

  // async getVideos(): Promise<Video[]> {
  async getVideos() {
    const { data, error } = await this.#client
      .from<Required<Pick<Video, "id" | "filename" | "width" | "height" | "duration">>>("video")
      .select("id, filename, width, height, duration")

      if (error || data == null) {
      return Promise.reject(error?.message ?? "no data")
    }
    return data
  }

  async getPoses(videoId: number, poseType: PoseType): Promise<Required<Pick<Pose, "id" | "time">>[]> {
    const { data, error } = await this.#client
      .from<Required<Pick<Pose, "id" | "time">>>("pose")
      .select("id, time")
      // @ts-ignore
      .eq("video_id", videoId)
      // @ts-ignore
      .eq("type", poseType)

    if (error || data == null) {
      return Promise.reject(error?.message ?? "no data")
    }
    return data
  }
}

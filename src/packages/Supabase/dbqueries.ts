import type { SupabaseClient } from "@supabase/supabase-js"

export default class DbQueries {
  #client: SupabaseClient
  #logger: Logger

  constructor(client: SupabaseClient, logger: Logger) {
    this.#client = client
    this.#logger = logger
  }

  async hasVideo(filename: string): Promise<boolean> {
    const { data, error } = await this.#client.from<Video>("video").select("id").eq("filename", filename).limit(1)
    if (error) {
      this.#logger.error(error.message)
      return true
    }
    this.#logger.info(`File exists in db ${filename}`)
    return data !== null && data.length > 0
  }

  async addVideo(obj: Video): Promise<number | undefined> {
    const { data, error } = await this.#client.from<Video>("video").upsert(obj)
    if (error) {
      this.#logger.error(error.message)
      return
    }
    this.#logger.info(`File added ${obj.filename}`)
    return data !== null && data[0] !== null ? data[0].id : undefined
  }

  async addPose(obj: Pose): Promise<number | undefined> {
    const { data, error } = await this.#client.from<Pose>("pose").upsert(obj)
    if (error) {
      this.#logger.error(error.message)
      return
    }
    this.#logger.info(`Pose added - ${obj.type}`)
    return data !== null && data[0] !== null ? data[0].id : undefined
  }

  async addKeypoints(obj: Keypoint[]): Promise<void> {
    const { error } = await this.#client.from<Keypoint>("keypoint").upsert(obj, { returning: "minimal" })
    if (error) {
      this.#logger.error(error.message)
      return
    }
    this.#logger.info(`${obj.length} Keypoints added`)
  }
}

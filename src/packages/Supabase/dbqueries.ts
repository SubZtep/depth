import type { SupabaseClient } from "@supabase/supabase-js"

export default class DbQueries {
  #client: SupabaseClient
  #logger: Logger

  constructor(client: SupabaseClient, logger: Logger) {
    this.#client = client
    this.#logger = logger
  }

  async hasVideo(filename: string): Promise<boolean> {
    const { data, error } = await this.#client.from<Supabase.Video>("video").select("id").eq("filename", filename).limit(1)
    if (error) {
      this.#logger.error(error.message)
      return true
    }
    return data !== null && data.length > 0
  }

  async addVideo(obj: Supabase.Video): Promise<number | undefined> {
    const { data, error } = await this.#client.from<Supabase.Video>("video").upsert(obj)
    if (error) {
      this.#logger.error(error.message)
      return
    }
    return data !== null && data[0] !== null ? data[0].id : undefined
  }
}

import type { Plugin, InjectionKey } from "vue"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import DbQueries from "./dbqueries"

const supabaseKey: InjectionKey<SupabaseClient> = Symbol("supabase")

export default {
  install(app, options: SupabasePluginOptions) {
    const supabase = createClient(options.url!, options.key!, options.options ?? {})
    globalThis.supabase = supabase // FIXME: for directive use, temp until we have a better solution
    app.provide(supabaseKey, supabase)
  },
} as Plugin

interface SupabaseOptions {
  logger?: Logger
}

export function useSupabase(options: SupabaseOptions = {}) {
  const { logger = console } = options

  const supabase = inject<SupabaseClient>(supabaseKey)!
  //TODO: wrapper or something nice
  const db = new DbQueries(supabase, logger)

  return {
    supabase,
    db,
  }
}

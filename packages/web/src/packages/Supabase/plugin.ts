import type { Plugin } from "vue"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import DbQueries from "./dbqueries"

export default {
  install(app, options: SupabasePluginOptions) {
    // FIXME: temp until we have a better solution
    globalThis.supabase = createClient(options.url!, options.key!, options.options)
  },
} as Plugin

interface SupabaseOptions {
  logger?: Logger
}

export function useSupabase(options: SupabaseOptions = {}) {
  const { logger = console } = options
  const supabase: SupabaseClient = globalThis.supabase
  const db = new DbQueries(globalThis.supabase, logger)

  return {
    supabase,
    db,
  }
}

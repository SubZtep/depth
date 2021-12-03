import type { Plugin } from "vue"
import type { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
// import DbQueries from "../../web/src/misc/dbqueriesrc/misc/dbqueries"

type Logger = any

interface PluginOptions {
  url?: string
  key?: string
  options?: SupabaseClientOptions
}

export const SupabasePlugin: Plugin = function (_app, options: PluginOptions) {
  const clientOptions: SupabaseClientOptions = {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    ...options.options,
  }

  // FIXME: globalThis is temp until we have a better solution
  globalThis.supabase = createClient(options.url!, options.key!, clientOptions)
}

interface SupabaseOptions {
  logger?: Logger
}

export function useSupabase(_options: SupabaseOptions = {}) {
  // const { logger = console } = options
  const supabase: SupabaseClient = globalThis.supabase
  // const db = new DbQueries(globalThis.supabase, logger)

  return {
    supabase,
    // db,
  }
}
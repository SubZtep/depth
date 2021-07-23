import type { Plugin, InjectionKey } from "vue"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"

const supabaseKey: InjectionKey<SupabaseClient> = Symbol("supabase")

export default {
  install(app, options: SupabaseOptions) {
    const supabase = createClient(options.url, options.key, options.options ?? {})
    app.provide(supabaseKey, supabase)
  },
} as Plugin

export function useSupabase() {
  return inject<SupabaseClient>(supabaseKey)!
}

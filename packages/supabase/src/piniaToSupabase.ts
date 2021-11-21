import "pinia"
import type { PiniaPlugin } from "pinia"
import { useSupabase } from "."

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    supabase?: {
      table: string
      fields: string[]
      /** Provided field must have value */
      notEmptyField?: string
    }
  }
}

export const piniaToSupabase: PiniaPlugin = ({ options, store }) => {
  if (!options.supabase) return
  const { table, fields, notEmptyField } = options.supabase
  if (notEmptyField && !store[notEmptyField]) return
  const { supabase } = useSupabase()

  store.$subscribe(async () => {
    await supabase.from(table).upsert(Object.fromEntries(fields.map(field => [field, store[field]])))
  })
}

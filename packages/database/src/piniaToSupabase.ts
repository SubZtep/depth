import type { PiniaPluginContext, Store } from "pinia"
import { useSupabase } from "."

export function piniaToSupabase({ options: { supabase: pluginOptions }, store }: PiniaPluginContext) {
  if (!pluginOptions) return
  const { table, fields, truthyField } = pluginOptions
  if (truthyField && !store[truthyField]) return
  const { supabase } = useSupabase()

  const tableValues = (store: Store): { [key: typeof fields[number]]: string | number } =>
    Object.fromEntries(fields.map(field => [field, store[field]]))

  store.$subscribe(async () => {
    console.log({ store, table, fields, supabase, tableValues })
    // const { error } = await supabase.from(table).upsert(tableValues(store), { returning: "minimal" })
    // if (error) throw new Error(`piniaToSupabase ${error.message}`)
  })
}

declare module "pinia" {
  export interface DefineStoreOptions<Id extends string, S extends StateTree, G, A>
    extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
    /**
     * One-way sync of store data to Supabase.
     *
     * @example
     *
     * ```js
     * defineStore("player", {
     *   state: () => ({
     *     uuid: useStorage("player.uuid", ""),
     *     position: { x: 0, y: 0, z: 0 } as Vector,
     *   }),
     *   supabase: {
     *     table: "metasnail",
     *     fields: ["uuid", "position"],
     *     truthyField: "uuid",
     *   },
     * })
     * ```
     */
    supabase?: {
      /** Supabase table name. */
      table: string
      /** Fields to sync. State keys and table names must be identical. */
      fields: string[]
      /** If given then the field value must be truthy for sync. */
      truthyField?: string
    }
  }
}

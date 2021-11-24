import type { RealtimeSubscription, SupabaseRealtimePayload } from "@depth/supabase"
import { useSupabase } from "@depth/supabase"
import { usePlayerStore } from "~/stores/player"

function onMetaSnail(playerStore: ReturnType<typeof usePlayerStore>, metaSnails: MetaSnail[]) {
  return (payload: SupabaseRealtimePayload<MetaSnail>) => {
    // console.log(payload.new.position)
    if (playerStore.uuid === payload.new.uuid) return

    if (payload.eventType === "INSERT") {
      metaSnails.push(payload.new)
    }

    const idx = metaSnails.findIndex(metaSnail => metaSnail.uuid === payload.new.uuid)
    if (idx < 0) throw new Error(`MetaSnail - ${payload.new.uuid} not found`)

    if (payload.eventType === "DELETE") {
      metaSnails.splice(idx, 1)
      return
    }

    for (const key in payload.new) {
      metaSnails[idx][key] = payload.new[key]
    }
  }
}

export async function useMetaSnails() {
  const playerStore = usePlayerStore()
  const { supabase } = useSupabase()

  const metaSnails: MetaSnail[] = reactive([])

  // get init data
  const { data, error } = await supabase.from<MetaSnail>("metasnail").select("*").neq("uuid", playerStore.uuid)
  if (error || !data) throw new Error(`MetaPara - ${error?.message ?? "no init data"}`)
  for (const metaSnail of data) {
    metaSnails.push(metaSnail)
  }

  // subscribe to updates
  // FIXME: filter out activa player if possible
  // not working (and it shouldn't): .from(`metasnail:uuid=not_eq.${uuid}`)
  // https://supabase.com/docs/reference/javascript/subscribe#listening-to-row-level-changes
  const metasnailSubscription: RealtimeSubscription = supabase
    .from("metasnail")
    .on("*", onMetaSnail(playerStore, metaSnails))
    .subscribe()

  tryOnBeforeUnmount(async () => {
    if (metasnailSubscription) {
      await supabase.removeSubscription(metasnailSubscription)
    }
  })

  return {
    metaSnails,
  }
}

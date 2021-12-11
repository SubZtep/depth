// import type { RealtimeSubscription, SupabaseRealtimePayload } from "@depth/supabase"
import { useSupabase } from "@depth/database"
import { usePlayerStore } from "~/stores/player"

type RealtimeSubscription = any
type SupabaseRealtimePayload<T> = any

function onMetaSnail(playerStore: ReturnType<typeof usePlayerStore>, metaSnails: MetaSnail[]) {
  return (payload: SupabaseRealtimePayload<MetaSnail>) => {
    if (playerStore.uuid === payload.new.uuid) return

    if (payload.eventType === "INSERT") {
      metaSnails.push(payload.new)
    }

    const index = metaSnails.findIndex(metaSnail => metaSnail.uuid === payload.new.uuid)
    if (index < 0) throw new Error(`MetaSnail - ${payload.new.uuid} not found`)

    if (payload.eventType === "DELETE") {
      metaSnails.splice(index, 1)
      return
    }

    for (const key in payload.new) {
      metaSnails[index][key] = payload.new[key]
    }
  }
}

export async function useMetaSnails() {
  const playerStore = usePlayerStore()
  const { supabase } = useSupabase()

  const metaSnails: MetaSnail[] = reactive([])
  let playerPosition: PositionTuple = [0, 0, 0]

  // get init data
  const { data, error } = await supabase.from<MetaSnail>("metasnail").select("*")
  if (error || !data) throw new Error(`MetaPara - ${error?.message ?? "no init data"}`)
  for (const metaSnail of data) {
    if (playerStore.uuid === metaSnail.uuid) {
      playerPosition = metaSnail.position
    } else {
      metaSnails.push(metaSnail)
    }
  }

  let metasnailSubscription: RealtimeSubscription

  const subscribe = () => {
    // subscribe to updates
    // FIXME: filter out activa player if possible
    // not working (and it shouldn't by docs): .from(`metasnail:uuid=neq.${uuid}`)
    // https://supabase.com/docs/reference/javascript/subscribe#listening-to-row-level-changes
    metasnailSubscription = supabase.from("metasnail").on("*", onMetaSnail(playerStore, metaSnails)).subscribe()
  }

  const unsubscribe = async () => {
    if (metasnailSubscription) {
      await supabase.removeSubscription(metasnailSubscription)
    }
  }

  return {
    playerPosition,
    metaSnails,
    subscribe,
    unsubscribe,
  }
}

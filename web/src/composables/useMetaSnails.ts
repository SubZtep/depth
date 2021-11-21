import { useSupabase } from "@depth/supabase"
import type { Vector, Rotation } from "@dimforge/rapier3d-compat"
import { usePlayerStore } from "~/stores/player"
import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"
import { v4 as uuidv4 } from "uuid"
import { TYPE } from "vue-toastification"

type MetaSnail = {
  uuid: string
  position: Vector
  rotation: Rotation
  created_at: string
  updated_at: string
}

export function useMetaSnails() {
  const { supabase } = useSupabase()
  const playerStore = usePlayerStore()
  const toast = useToast()

  const metaSubscribe = (callback: (metasnail: MetaSnail) => void | Promise<void>) => {
    const metasnailSubscription = supabase
      .from("metasnail")
      .on("*", ({ new: metasnail }: { new: MetaSnail }) => {
        if (playerStore.uuid !== metasnail.uuid) {
          callback(metasnail)
        }
      })
      .subscribe()

    onBeforeUnmount(async () => {
      await supabase.removeSubscription(metasnailSubscription)
    })
  }

  const validateHappiness = () => {
    !playerStore.uuid &&
      toast(
        {
          component: CancellableEventToast,
          props: {
            message: "Are you happy to make Your snail visible to the public?",
            event: () => (playerStore.uuid = uuidv4()),
          },
        },
        { icon: "fas fa-shield-check", type: TYPE.SUCCESS, timeout: 13666 }
      )
  }

  return {
    metaSubscribe,
    validateHappiness,
  }
}

export function validateHappiness() {
  const playerStore = usePlayerStore()
  const toast = useToast()

  !playerStore.uuid &&
    toast(
      {
        component: CancellableEventToast,
        props: {
          message: "Are you happy to make Your snail visible to the public?",
          event: () => (playerStore.uuid = uuidv4()),
        },
      },
      { icon: "fas fa-shield-check", type: TYPE.SUCCESS, timeout: 13666 }
    )
}

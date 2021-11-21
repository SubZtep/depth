import { useSupabase } from "@depth/supabase"
import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"
import { v4 as uuidv4 } from "uuid"
import { TYPE } from "vue-toastification"

type MetaSnail = {
  uuid: string
  name: string
  color: number
  position: Vector
  rotation: Rotation
  created_at: string
  updated_at: string
}

export function useMetaSnails(store: Pick<MetaSnail, "uuid">) {
  const { supabase } = useSupabase()
  const toast = useToast()

  const metaSubscribe = (callback: (metasnail: MetaSnail) => void | Promise<void>) => {
    const metasnailSubscription = supabase
      .from("metasnail")
      .on("*", ({ new: metasnail }: { new: MetaSnail }) => {
        if (store.uuid !== metasnail.uuid) {
          callback(metasnail)
        }
      })
      .subscribe()

    onBeforeUnmount(async () => {
      await supabase.removeSubscription(metasnailSubscription)
    })
  }

  const validateHappiness = () => {
    toast(
      {
        component: CancellableEventToast,
        props: {
          message: "Are you happy to make Your snail visible to the public?\n(source on github)",
          event: () => (store.uuid = uuidv4()),
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

import type { RealtimeSubscription, SupabaseRealtimePayload } from "@depth/supabase"
import { useSupabase } from "@depth/supabase"
import CancellableToast from "~/components/toasts/CancellableToast.vue"
import { v4 as uuidv4 } from "uuid"
import { TYPE } from "vue-toastification"
import { usePlayerStore } from "~/stores/player"
// import { useSingleton } from "@depth/misc"
// import { Object3D } from "@depth/three.js"
// import useSceneHelper from "~/composables/useSceneHelper"

// export function useMetaSnails({ uuid }: Pick<MetaSnail, "uuid">) {
export function useMetaSnails() {
  // const { single } = useSingleton()

  const playerStore = usePlayerStore()

  const { supabase } = useSupabase()
  const toast = useToast()
  // const { addForPage } = useSceneHelper()

  const metaSnails: MetaSnail[] = reactive([])

  let metasnailSubscription: RealtimeSubscription

  onBeforeUnmount(async () => {
    metasnailSubscription && (await supabase.removeSubscription(metasnailSubscription))
  })

  const handleRemoteMetaSnail = (metaSnail: MetaSnail) => {
    metaSnails.push(metaSnail)

    // if (metaSnails.has(uuid)) {
    //   const metasnail = metaSnails.get(uuid)!
    //   metasnail.position.set(position.x, position.y, position.z)
    //   metasnail.setRotationFromQuaternion(rotation)
    // } else {
    //   metaSnails.set(uuid, metaSnail)
    // }

    // if (!metaSnails.has(uuid)) {
    //   // const metaGeometry = new TorusKnotGeometry(9, 0.8, 24, 5, 4, 1)
    //   // const metaMaterial = new MeshPhongMaterial({ color: new Color(color), shininess: 150, flatShading: true })
    //   // const meta = snailShell.clone(true)
    //   // meta.traverse((node: any) => {
    //   //   if (node.material) node.material = metaMaterial
    //   // })
    //   // meta.scale.set(0.06, 0.06, 0.06)
    //   // const meta = metaSnail(color)
    //   // metaSnails.set(uuid, meta)
    //   // addForPage(meta)
    //   metaSnails.set(uuid, metaSnail)
    // } else {
    //   const metasnail = metaSnails.get(uuid)!
    //   metasnail.position.set(position.x, position.y, position.z)
    //   metasnail.setRotationFromQuaternion(rotation)
    // }

    // const metasnail = metaSnails.get(uuid)!
    // // TODO: lerp position
    // // metasnail.position.set(position.x, position.y, position.z)
    // // @ts-ignore
    // metasnail.setRotationFromQuaternion(rotation)
  }

  /**
   * Subscribe to Supabase table if metasnails stream.
   * @param callback - Function that receive the data from the stream.
   */
  const metaSubscribe = (callback: (metasnail: MetaSnail) => void | Promise<void>) => {
    // FIXME: filter out activa player if possible
    // not working (and it shouldn't): .from(`metasnail:uuid=not_eq.${uuid}`)
    // https://supabase.com/docs/reference/javascript/subscribe#listening-to-row-level-changes
    metasnailSubscription = supabase
      .from("metasnail")
      .on("*", (payload: SupabaseRealtimePayload<MetaSnail>) => {
        if (playerStore.uuid !== payload.new.uuid) {
          callback(payload.new)
        }
      })
      .subscribe()
  }

  /**
   * Query meta table for initial values
   */
  const metaInit = async (uuid: string) => {
    const { data, error } = await supabase.from<MetaSnail>("metasnail").select("*").neq("uuid", uuid)
    if (error || !data) throw new Error(`MetaPara - ${error?.message ?? "no data"}`)
    for (const meta of data) {
      handleRemoteMetaSnail(meta)
    }
  }

  const validateHappiness = () => {
    const message = "Are you happy to make Your snail visible to the public?"
    let uuid = uuidv4()

    toast(
      {
        component: CancellableToast,
        props: { message },
        listeners: {
          cancel: () => {
            uuid = ""
            console.log("LISTENER cancel")
          },
        },
      },
      {
        icon: "fas fa-shield-check",
        type: TYPE.SUCCESS,
        timeout: 6969,
        onClose: () => {
          playerStore.uuid = uuid
        },
      }
    )
  }

  return {
    handleRemoteMetaSnail,
    metaSubscribe,
    validateHappiness,
    metaSnails,
    metaInit,
  }
}

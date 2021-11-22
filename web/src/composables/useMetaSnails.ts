import { useSupabase } from "@depth/supabase"
import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"
import { v4 as uuidv4 } from "uuid"
import { TYPE } from "vue-toastification"
import { useSingleton } from "@depth/misc"
import { MeshPhongMaterial, Color, TorusKnotGeometry } from "@depth/three.js"
import useSceneHelper from "~/composables/useSceneHelper"
// import metaSnail from "~/3D/meshes/meta-snail"

const metaSnails = new Map<string, Object3D>()

export function useMetaSnails({ uuid }: Pick<MetaSnail, "uuid">) {
  const { single } = useSingleton()
  const { supabase } = useSupabase()
  const toast = useToast()
  const { addForPage } = useSceneHelper()

  // const metaSnails = single("MetaSnails", new Map<string, Object3D>())
  // const metaSnails = reactive(new Map<string, MetaSnail>())
  // const metaSnails = new Map<string, Object3D>()
  const metaSnails: MetaSnail[] = reactive([])

  // const handleRemoteMetaSnail = ({ uuid, position, rotation, name, color }: MetaSnail) => {
  const handleRemoteMetaSnail = (metaSnail: MetaSnail) => {
    // console.log("ERTGBERGRE", metaSnail)
    // metaSnails.set(uuid, metaSnail)
    metaSnails.push(metaSnail)
    /* eslint-disable @typescript-eslint/ban-ts-comment */

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
    const metasnailSubscription = supabase
      .from("metasnail")
      .on("*", ({ new: metasnail }: { new: MetaSnail }) => {
        if (uuid !== metasnail.uuid) {
          callback(metasnail)
        }
      })
      .subscribe()

    onBeforeUnmount(async () => {
      await supabase.removeSubscription(metasnailSubscription)
    })
  }

  /**
   * Query meta table for initial values
   */
  const metaInit = async () => {
    const { data, error } = await supabase.from<MetaSnail>("metasnail").select("*").neq("uuid", uuid)
    if (error || !data) throw new Error(`MetaPara - ${error?.message ?? "no data"}`)
    for (const meta of data) {
      handleRemoteMetaSnail(meta)
    }
  }

  const validateHappiness = () => {
    toast(
      {
        component: CancellableEventToast,
        props: {
          message: "Are you happy to make Your snail visible to the public?\n(source on github)",
          event: () => (uuid = uuidv4()),
        },
      },
      { icon: "fas fa-shield-check", type: TYPE.SUCCESS, timeout: 13666 }
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

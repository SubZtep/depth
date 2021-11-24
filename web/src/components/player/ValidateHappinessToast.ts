import { v4 as uuidv4 } from "uuid"
import { TYPE } from "vue-toastification"
import { usePlayerStore } from "~/stores/player"
import CancellableToast from "~/components/toasts/CancellableToast.vue"

export default defineComponent({
  setup(_, { slots }) {
    const playerStore = usePlayerStore()
    if (playerStore.uuid || !slots.default) {
      return () => {}
    }

    const toast = useToast()
    let uuid = uuidv4()

    toast(
      {
        component: CancellableToast,
        props: {
          // FIXME: send as slot and be rendered in template
          message: slots
            .default({ uuid })
            .map(slot => slot.children)
            .join("\n"),
        },
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
        timeout: 16669,
        onClose: () => {
          playerStore.uuid = uuid
        },
      }
    )

    return () => {}
  },
})

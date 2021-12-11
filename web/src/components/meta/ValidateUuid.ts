import { usePlayerStore } from "~/stores/player"
import OkayToast from "~/components/toasts/OkayToast.vue"
import { TYPE } from "vue-toastification"
import router from "~/router"

export default defineComponent({
  setup(_, { slots }) {
    const playerStore = usePlayerStore()
    if (playerStore.uuid || !slots.default) {
      return () => {}
    }

    const toast = useToast()

    toast(
      {
        component: OkayToast,
        props: {
          message: slots
            .default()
            .map(slot => slot.children)
            .join("\n"),
        },
        listeners: {
          okay: () => {
            router.push("")
          },
        },
      },
      {
        icon: "fas fa-face-scream",
        type: TYPE.WARNING,
        timeout: 16669,
      }
    )

    return () => {}
  },
})

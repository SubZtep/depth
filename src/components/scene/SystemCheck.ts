declare const Modernizr: Record<string, boolean>
import { capitalize } from "~/misc/utils"

export default defineComponent({
  emits: ["done"],

  setup(_, { emit }) {
    const toast = useToast()

    useScriptTag("/modernizr-custom.js", () => {
      const notSupported = Object.entries(Modernizr)
        .filter(([, value]) => !value)
        .map(([key]) => key)

      const { pause } = useIntervalFn(() => {
        if (notSupported.length > 0) {
          toast.error(`${capitalize(notSupported.shift()!)} is not supported`, { icon: false })
        } else {
          pause()
          toast.warning("Development build — giant file sizes, easy to break")
          emit("done")
        }
      }, 500)
    })
  },

  render() {
    return () => null
  },
})
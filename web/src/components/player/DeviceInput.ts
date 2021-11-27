import { useDevice } from "~/composables/useDevice"

export default defineComponent({
  setup(_, { slots }) {
    return () => slots.default?.(useDevice())
  },
})

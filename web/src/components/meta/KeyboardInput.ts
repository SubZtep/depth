import { useKeyboard } from "~/composables/useKeyboard"

export default defineComponent({
  setup(_, { slots }) {
    const { joystick, action } = useKeyboard()
    return () => slots.default?.({ joystick, action })
  },
})

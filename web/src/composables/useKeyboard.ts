import { useMagicKeys } from "@vueuse/core"
import { watchEffect } from "vue"

/** Keyboard input by player. */
export function useKeyboard(): PlayerInput {
  const { current } = useMagicKeys()

  const joystick = ref<PositionTuple>([0, 0, 0])
  const action = ref<boolean>(false)

  watchEffect(() => {
    joystick.value[0] = current.has("ArrowLeft") ? -1 : current.has("ArrowRight") ? 1 : 0
    joystick.value[2] = current.has("ArrowUp") ? -1 : current.has("ArrowDown") ? 1 : 0
    action.value = current.has("ControlLeft")
  })

  return {
    joystick,
    action,
  }
}

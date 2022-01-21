import { watchEffect } from "vue"
import { useMagicKeys } from "@vueuse/core"
import { usePreferencesStore } from "~/stores/preferences"

/** Keyboard input by player. */
export function useKeyboard(): PlayerInput {
  const { current } = useMagicKeys()
  const preferencesStore = usePreferencesStore()

  const joystick = ref<PositionTuple>([0, 0, 0])
  const action = ref<boolean>(false)

  watchEffect(() => {
    joystick.value[0] = current.has(preferencesStore.keyboardLeft)
      ? -1
      : current.has(preferencesStore.keyboardRight)
        ? 1
        : 0
    joystick.value[2] = current.has(preferencesStore.keyboardUp)
      ? -1
      : current.has(preferencesStore.keyboardDown)
        ? 1
        : 0
    action.value = current.has(preferencesStore.keyboardAction)
  })

  return {
    joystick,
    action,
  }
}

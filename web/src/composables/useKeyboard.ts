export function useKeyboard() {
  const { current } = useMagicKeys()

  const joystick = ref<[number, number]>([0, 0])
  const action = ref<boolean>(false)

  watchEffect(() => {
    joystick.value = [
      current.has("ArrowLeft") ? -1 : current.has("ArrowRight") ? 1 : 0,
      current.has("ArrowUp") ? -1 : current.has("ArrowDown") ? 1 : 0,
    ]
    action.value = current.has("ControlLeft")
  })

  return {
    joystick,
    action,
  }
}

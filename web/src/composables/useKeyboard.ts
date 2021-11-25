const enum PositionAxis {
  X = 0,
  Y = 1,
  Z = 2,
}

export function useKeyboard() {
  const { current } = useMagicKeys()

  const joystick = ref<PositionTuple>([0, 0, 0])
  const action = ref<boolean>(false)

  watchEffect(() => {
    joystick.value[PositionAxis.X] = current.has("ArrowLeft") ? -1 : current.has("ArrowRight") ? 1 : 0
    joystick.value[PositionAxis.Z] = current.has("ArrowUp") ? -1 : current.has("ArrowDown") ? 1 : 0
    action.value = current.has("ControlLeft")
  })

  return {
    joystick,
    action,
  }
}

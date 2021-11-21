import type { Vector, Rotation } from "@dimforge/rapier3d-compat"

export function useKeyboard() {
  const { current } = useMagicKeys()

  const joystick = ref<Vector>({ x: 0, y: 0, z: 0 })
  const action = ref<boolean>(false)

  watchEffect(() => {
    joystick.value.x = current.has("ArrowLeft") ? -1 : current.has("ArrowRight") ? 1 : 0
    joystick.value.z = current.has("ArrowUp") ? -1 : current.has("ArrowDown") ? 1 : 0
    action.value = current.has("ControlLeft")
  })

  return {
    joystick,
    action,
  }
}

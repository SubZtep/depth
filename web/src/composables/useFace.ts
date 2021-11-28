/** Webcam input with mediapipe */
export function useKeyboard(): PlayerInput {
  const joystick = ref<PositionTuple>([0, 0, 0])
  const action = ref<boolean>(false)

  return {
    joystick,
    action,
  }
}

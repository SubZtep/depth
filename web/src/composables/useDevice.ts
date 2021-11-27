import { throttledWatch, useParallax } from "@vueuse/core"

/** Device move (mobile or mouse) input by player. */
export function useDevice(): PlayerInput {
  const parallax = reactive(useParallax(document.querySelector("#scene") as HTMLElement))
  const joystick = ref<PositionTuple>([0, 0, 0])
  const action = ref<boolean>(false)

  throttledWatch(
    parallax,
    () => {
      joystick.value[0] = parallax.roll
      joystick.value[2] = parallax.tilt
    },
    {
      throttle: 50,
      // throttle: import.meta.env.VITE_SUPABASE_THROTTLE,
    }
  )

  return {
    joystick,
    action,
  }
}

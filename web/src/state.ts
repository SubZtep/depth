import { statem } from "@depth-lib/statem"

export const loopState = statem("core", {
  fps: Number.POSITIVE_INFINITY,
  dark: true,
})

Object.assign(globalThis, {
  setFPS: (fps: number) => (loopState.fps = fps),
  toggleDark: () => (loopState.dark = !loopState.dark),
})

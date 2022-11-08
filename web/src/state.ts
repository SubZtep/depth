import { statem } from "@depth/statem"

export const loopState = statem("core", {
  fps: Number.POSITIVE_INFINITY,
  dark: true,
  width: window.innerWidth,
  height: window.innerHeight
})

Object.assign(globalThis, {
  setFPS: (fps: number) => (loopState.fps = fps),
  toggleDark: () => (loopState.dark = !loopState.dark)
})

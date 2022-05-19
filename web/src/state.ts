import { statem } from "@depth-lib/statem"
// statem<DMeterState>({
//   name: "meter",
//   default: {},
// })

// statem("theme", {
//   property: "--bodybg",
//   values: ["--bg0", "--bg1", "--bg2", "--bg3", "--bg4", "--bg5", "--bg6", "--bg7"],
// })

// statem("core", {
//   fps: Number.POSITIVE_INFINITY,
//   dark: true,
//   // fps: 60,
// })

export const loopState = statem("core", {
  fps: Number.POSITIVE_INFINITY,
  dark: true,
})

Object.assign(globalThis, {
  setFPS: (fps: number) => (loopState.fps = fps),
  toggleDark: () => (loopState.dark = !loopState.dark),
})

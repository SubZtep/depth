import { stateMake } from "@depth/statem"

// export const canvasStates = new Map()

// canvasStates.set(
//   "aaa",
//   stateMake({
//     running: false,
//     offscreen: false,
//     fps: 60,
//   })
// )

// canvasStates.set(
//   "bbb",
//   stateMake({
//     running: false,
//     offscreen: false,
//     fps: 60,
//   })
// )
// export const canvasStates = new Map()

stateMake(
  {
    running: false,
    offscreen: false,
    fps: 60,
  },
  "aaa"
)

stateMake(
  {
    running: false,
    offscreen: false,
    fps: 60,
  },
  "bbb"
)

// export const state1 = stateMake(initialState)
// export const state2 = stateMake(initialState)

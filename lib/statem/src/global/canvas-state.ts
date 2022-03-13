import type { StoreProps } from "../store"
import { stateMake } from  "../index"

const initialState = {
  running: false,
  offscreen: false,
  fps: 60,
  // fps: Infinity
}

export default stateMake(initialState)

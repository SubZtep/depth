import type { StoreProps } from "../store"
import { stateMake } from  "../index"

const initialState = {
  running: false,
  offscreen: false
}

export default stateMake(initialState)

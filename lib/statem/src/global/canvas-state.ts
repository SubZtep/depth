import type { StoreProps } from "../store"
import { stateMake } from  "../index"

const initialState = {
  running: false,
  antialias: false
}

export default stateMake(initialState)

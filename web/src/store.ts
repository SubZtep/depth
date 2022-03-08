import type { StoreProps } from  "@depth/statem"
import { stateMake } from  "@depth/statem"

export interface CanvasState {
  running: boolean
  antialias: boolean
  preferOffscreen: boolean
  txt: string
}

const initialState: CanvasState = {
  running: false,
  antialias: false,
  preferOffscreen: true,
  txt: "test"
}

const actions: StoreProps<CanvasState>["actions"] = {
  startLoop(context) {
    context.commit("setRunning", true)
  },
  stopLoop(context) {
    context.commit("setRunning", false)
  },
}

const mutations: StoreProps<CanvasState>["mutations"] = {
  setRunning(state, payload) {
    if (state.running !== payload) {
      state.running = payload
    }
    return state
  },
}

export default stateMake<CanvasState>({ initialState, actions, mutations })

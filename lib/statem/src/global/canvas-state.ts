import type { StoreProps } from "../store"
// import { useSingleton } from "@depth/misc"
import { stateMake } from  "../index"

export interface CanvasStatem {
  running: boolean
  antialias: boolean
  preferOffscreen: boolean
}

const initialState: CanvasStatem = {
  running: false,
  antialias: false,
  preferOffscreen: false
}

const actions: StoreProps<CanvasStatem>["actions"] = {
  startLoop(context) {
    context.commit("setRunning", true)
  },
  stopLoop(context) {
    context.commit("setRunning", false)
  },
}

const mutations: StoreProps<CanvasStatem>["mutations"] = {
  setRunning(state, payload) {
    if (state.running !== payload) {
      state.running = payload
    }
    return state
  },
}

export default stateMake<CanvasStatem>({ initialState, actions, mutations })
// const canvasState = stateMake<CanvasStatem>({ initialState, actions, mutations })

// const { singleton } = useSingleton()
// singleton.set("canvasState", canvasState)

// export default canvasState

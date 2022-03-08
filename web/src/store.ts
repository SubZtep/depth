import Statem from "@depth/statem"

interface CanvasState {
  running: boolean
  antialias: boolean
  preferOffscreen: boolean
}

const initialState: CanvasState = {
  running: false,
  antialias: false,
  preferOffscreen: true,
}

const actions = {
  startLoop(context) {
    context.commit("setRunning", true)
  },
  stopLoop(context) {
    context.commit("setRunning", false)
  },
}

const mutations = {
  setRunning(state, payload) {
    if (state.running !== payload) {
      state.running = payload
    }
    return state
  },
}

const state = new Statem<CanvasState>({
  actions,
  mutations,
  initialState,
})

export default state

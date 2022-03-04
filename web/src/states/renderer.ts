import Statem from "@depth/statem"

interface RendererState {
  running: boolean;
  antialias?: boolean
  preferOffscreen?: boolean
}

const initialState: RendererState = {
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
  setRunning(state: RendererState, payload: boolean) {
    if (state.running !== payload) {
      // TODO: move this check to the store core
      state.running = payload
    }
    return state
  },
  //
}

export default new Statem({
  actions,
  mutations,
  initialState,
})

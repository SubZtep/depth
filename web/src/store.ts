// import Store from "beedle"
import Statem from "@depth/statem"

const initialState: State = {
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
    // console.log("STAT$E", state)
    if (state.running !== payload) {
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

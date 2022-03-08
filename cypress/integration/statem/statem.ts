import type { StoreProps } from "../../../lib/statem/src/store"
import { stateMake } from "../../../lib/statem/src/index"


interface State {
  running: boolean
  txt: string
}

const initialState: State = {
  running: false,
  txt: "test"
}

const actions: StoreProps<State>["actions"] = {
  startLoop(context) {
    context.commit("setRunning", true)
  },
  stopLoop(context) {
    context.commit("setRunning", false)
  },
}

const mutations: StoreProps<State>["mutations"] = {
  setRunning(state, payload) {
    if (state.running !== payload) {
      state.running = payload
    }
    return state
  },
}

const state = stateMake<State>({ initialState, actions, mutations })

describe("Statem", () => {
  it("set and get with property", () => {
    state.txt = "test2"
    expect(state.txt).to.equal("test2")
  })
})

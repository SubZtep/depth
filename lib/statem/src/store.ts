// type Action<T> = any
// type Action<T extends object> = (context: Store<T>, payload?: any) => void
type Action<T extends object> = (context: Store<T>, payload?: any) => void
type Mutation<T> = (state: T, payload?: any) => T
type Callback<T> = (data: T, oldData: T) => void

export interface Statem {
  subscribe(callback: Fn, keyOnly: string): void
}

export interface StoreProps<State extends object> {
  initialState: State
  actions?: Record<string, Action<State>>
  mutations?: Record<string, Mutation<State>>
}

/** Store class */
export class Store<State extends object> {
  actions: Record<string, Action<State>> = {}
  mutations: Record<string, Mutation<State>> = {}
  state!: State
  status: "resting" | "action" | "mutation" = "resting"
  // callbacks: Callback<State>[] = []
  callbacks = new Map<keyof State | "all", Callback<State | any>[]>()

  constructor(params: StoreProps<State>) {
    const self = this
    params.hasOwnProperty("actions") && (self.actions = params.actions!)
    params.hasOwnProperty("mutations") && (self.mutations = params.mutations!)

    this.callbacks.set("all", [])

    // Nain object property helpers (skip actions and mutations)
    for (const key in params.initialState) {
      Object.defineProperty(self, key, {
        set(v: any) {
          self.state[key] = v
        },
        get() {
          return self.state[key]
        }
      })
    }

    // The state is a Proxy.
    self.state = new Proxy<State>((params.initialState), {
      set(state, key, value) {
        // don't update (and callback) for an existing value
        if (state[key] !== value) {
          const oldState = { ...state }
          state[key] = value
          self.processCallbacks(self.state, oldState, key as keyof State)
        }

        // Reset the status ready for the next operation
        self.status = "resting"

        return true
      },
    })
  }

  /** A dispatcher for actions that looks in the actions collection and runs the action if it can find it. */
  dispatch(actionKey: keyof Store<State>["actions"], payload?: any) {
    const self = this

    // Run a quick check to see if the action actually exists before we try to run it
    if (typeof self.actions[actionKey] !== "function") {
      console.error(`Action "${actionKey}" doesn't exist.`)
      return false
    }

    self.status = "action"

    // Actually call the action and pass it the Store context and whatever payload was passed
    return self.actions[actionKey](self, payload)
  }

  /** Look for a mutation and modify the state object if that mutation exists by calling it. */
  commit(mutationKey: string, payload?: any) {
    const self = this
    self.status = "mutation"

    // Get a new version of the state by running the mutation and storing the result of it
    // @ts-ignore
    let newState = self.mutations[mutationKey](self.state, payload)

    // Update the old state with the new state returned from our mutation
    self.state = newState
  }

  /**
   * Fire off each callback that's run whenever the state changes
   * We pass in some data as the one and only parameter.
   * Returns a boolean depending if callbacks were found or not
   */
  processCallbacks(data: State, oldData: State, keyUpdated: keyof State) {
    const self = this
    self.callbacks.get("all")?.forEach(callback => callback(data, oldData))
    self.callbacks.get(keyUpdated)?.forEach(callback => callback(data[keyUpdated], oldData[keyUpdated]))
  }

  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * Returns boolean based on wether or not the callback was added to the collection
   */
  subscribe(callback: Callback<State>, keyOnly: keyof State | "all" = "all") {
    const self = this

    if (!self.callbacks.has(keyOnly)) {
      self.callbacks.set(keyOnly, [])
    }

    // A valid function, so it belongs in our collection
    self.callbacks.get(keyOnly)!.push(callback)
  }
}


export type IStore<T extends object> = {
  [key in keyof T]: T[key]
} & Store<T>

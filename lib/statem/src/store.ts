/* eslint-disable @typescript-eslint/no-this-alias, unicorn/no-this-assignment, unicorn/no-array-for-each */
// type Action<T extends object> = (context: Store<T>, payload?: any) => void
// type Mutation<T> = (state: T, payload?: any) => T
type Callback<T> = (data: T, oldData: T) => void

export interface Statem {
  subscribe(callback: Fn, keyOnly?: string): void
}

// export interface StoreProps<State extends object> {
//   initialState: State
// }

export class Store<State extends object> {
  state!: State
  callbacks = new Map<keyof State | "all", Callback<State | any>[]>()

  constructor(initialState: State) {
    const self = this

    this.callbacks.set("all", [])

    // Nain object property helpers (skip actions and mutations)
    for (const key in initialState) {
      Object.defineProperty(self, key, {
        set(v: any) {
          self.state[key] = v
        },
        get() {
          return self.state[key]
        },
      })
    }

    // The state is a Proxy.
    self.state = new Proxy<State>(initialState, {
      set(state, key, value) {
        if (state[key] !== value) {
          const oldState = { ...state }
          state[key] = value
          self.processCallbacks(self.state, oldState, key as keyof State)
        }
        return true
      },
    })
  }

  /**
   * Fire off each callback that's run whenever the state changes
   * We pass in some data as the one and only parameter.
   * Returns a boolean depending if callbacks were found or not
   */
  processCallbacks(data: State, oldData: State, keyUpdated: keyof State) {
    const self = this
    self.callbacks.get("all")?.forEach((callback) => callback(data, oldData))
    self.callbacks.get(keyUpdated)?.forEach((callback) => callback(data[keyUpdated], oldData[keyUpdated]))
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

  // patch(data: Partial<State>) {
  //   // const self = this
  //   // const oldState = { ...self.state }
  //   Object.assign(self.state, data)
  //   // self.processCallbacks(self.state, oldState, "all")
  // }
}

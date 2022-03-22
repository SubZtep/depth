type Callback<T> = (data: T, oldData: T) => void

export interface Statem {
  subscribe<T>(callback: Callback<T>): void
}

export class Store<State extends object> {
  private state!: State
  private callbacks = new Set<Callback<State>>() // TODO: WeakRef
  private patching = false

  constructor(initialState: State) {
    this.state = initialState

    this.state = new Proxy<State>(this.state, {
      set: (state, key, value) => {
        if (state[key] === value) {
          return true
        }
        const oldState = this.patching ? state : { ...state }
        if (!Reflect.set(state, key, value)) {
          return false
        }
        if (!this.patching) {
          this.processCallbacks(state, oldState)
        }
        return true
      },
    })

    for (const key in initialState) {
      Reflect.defineProperty(this, key, {
        set: (v: any) => {
          this.state[key] = v
        },
        get: () => {
          return this.state[key]
        },
      })
    }
  }

  /**
   * Fire off each callback that's run whenever the state changes
   * We pass in some data as the one and only parameter.
   * Returns a boolean depending if callbacks were found or not
   */
  processCallbacks(data: State, oldData: State) {
    for (const callback of this.callbacks) {
      callback(data, oldData)
    }
  }

  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * Returns boolean based on wether or not the callback was added to the collection
   */
  subscribe(callback: Callback<State>) {
    this.callbacks.add(callback)
  }

  toString() {
    return JSON.stringify(this.state)
  }

  /** Update multiple values and a single callback. */
  patch(data: Partial<State>) {
    const oldState = { ...this.state }
    this.patching = true
    //TODO: test, is it synchronous?
    Object.assign(this.state, data)
    this.processCallbacks(this.state, oldState)
    this.patching = false
  }
}

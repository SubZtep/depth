type Callback<T> = (data: T, oldData: T) => void

// export interface Statem {
//   subscribe<T>(callback: Callback<T>): Fn
// }

// type State = any

// export class Store<State extends object> {
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
   */
  processCallbacks(data: State, oldData: State) {
    for (const callback of this.callbacks) {
      callback(data, oldData)
    }
  }

  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * @returns Unsubscribe function
   */
  subscribe(callback: Callback<State>) {
    this.callbacks.add(callback)
    return () => {
      this.callbacks.delete(callback)
    }
  }

  unsubscribe(callback: Callback<State>) {
    if (this.callbacks.has(callback)) {
      this.callbacks.delete(callback)
    }
  }

  toString() {
    return JSON.stringify(this.state)
  }

  /** Update multiple values and a single callback. */
  patch(data: Partial<State>) {
    let changed = false
    for (const [key, value] of Object.entries(data)) {
      if (this.state[key] !== value) {
        changed = true
        break
      }
    }
    if (!changed) return

    const oldState = { ...this.state }
    this.patching = true
    //TODO: test, is it synchronous?
    Object.assign(this.state, data)
    this.processCallbacks(this.state, oldState)
    this.patching = false
  }
}

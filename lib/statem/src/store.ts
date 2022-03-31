export type State = Record<string | symbol, any>

type Callback = (data: State, oldData: State) => void

export interface Statem {
  subscribe(callback: Callback): Fn
  unsubscribe(callback: Callback): void
  patch(values: State): void
}

// export class Store<State extends object> {
export class Store implements Statem {
  private state!: State
  private callbacks = new Set<Callback>() // TODO: WeakRef
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
  subscribe(callback: Callback) {
    this.callbacks.add(callback)
    return () => {
      this.unsubscribe(callback)
    }
  }

  unsubscribe(callback: Callback) {
    if (this.callbacks.has(callback)) {
      this.callbacks.delete(callback)
    }
  }

  toString() {
    return JSON.stringify(this.state)
  }

  /** Update multiple values and a single callback. */
  patch(values: State) {
    let changed = false
    for (const [key, value] of Object.entries(values)) {
      if (this.state[key] !== value) {
        changed = true
        break
      }
    }
    if (!changed) return

    const oldState = { ...this.state }
    this.patching = true
    //TODO: test, is it synchronous?
    Object.assign(this.state, values)
    this.processCallbacks(this.state, oldState)
    this.patching = false
  }
}

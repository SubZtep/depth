type StateKey = string | symbol
export type State = Record<StateKey, any>

type Callback = (state: State, oldState: State) => void

export interface Statem {
  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * @returns Unsubscribe function
   */
  subscribe(callback: Callback, options?: CallbackOptions): Fn
  unsubscribe(callback: Callback): void
  // patch(values: State): void
  [key: StateKey]: any
}

interface CallbackOptions {
  /** Run callback only if the given key changes. */
  key?: StateKey

  /** Run callback automatically with the subscription. */
  immediate?: boolean
}

// export class Store<State extends object> {
export class Store implements Statem {
  private state!: State
  private callbacks = new Set<Callback>() // TODO: WeakRef
  private callbackOptions = new Map<Callback, CallbackOptions>()
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
  processCallbacks(state: State, oldState: State) {
    for (const callback of this.callbacks) {
      if (this.callbackOptions.has(callback)) {
        const options = this.callbackOptions.get(callback)!
        if (options.key && state[options.key] === oldState[options.key]) {
          continue
        }
      }
      callback(state, oldState)
    }
  }

  subscribe(callback: Callback, options?: CallbackOptions) {
    this.callbacks.add(callback)
    if (options) {
      this.callbackOptions.set(callback, options)
      if (options.immediate) {
        callback(this.state, this.state)
      }
    }
    return () => {
      this.unsubscribe(callback)
    }
  }

  unsubscribe(callback: Callback) {
    this.callbackOptions.delete(callback)
    this.callbacks.delete(callback)
  }

  toString() {
    return JSON.stringify(this.state, null, 2)
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
    Object.assign(this.state, values)
    this.processCallbacks(this.state, oldState)
    this.patching = false
  }
}

// import { Statem, OnFn, CallSettings, State } from "typings.js"
import { Statem, OnFn, CallSettings, State } from "../typings.d"

// TODO: WeakRef // export class Store<State extends object> {
export class Store<T extends object> implements Statem<T> {
  private state!: T
  private callbacks = new Set<OnFn>()
  private callbackOptions = new Map<OnFn, CallSettings>()
  private patching = false

  constructor(initialState: T) {
    this.state = initialState

    this.state = new Proxy<T>(this.state, {
      set: (state, key, value) => {
        // if (state[key] === value) {
        //   return true
        // }
        // const oldState = this.patching ? state : { ...state }
        // if (!Reflect.set(state, key, value)) {
        //   return false
        // }
        // if (!this.patching) {
        //   this.processCallbacks(state, oldState)
        // }

        const oldState = { ...this.state }
        // this.state[key] = value
        Reflect.set(state, key, value)
        // Object.assign<State, Partial<State>>(this.state, typeof key === "symbol" ? value : { [key]: value })
        this.processCallbacks(this.state, oldState)

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
      const options = this.callbackOptions.get(callback)
      const noMutation = options && options.key && state[options.key] === oldState[options.key]
      if (noMutation) continue

      callback(state, oldState)
    }
  }

  subscribe(callback: OnFn, options?: CallSettings) {
    this.callbacks.add(callback)
    if (options) {
      this.callbackOptions.set(callback, options)
      if (options.immediate) {
        callback(this.state, this.state)
      }
    }
    return () => this.unsubscribe(callback)
  }

  unsubscribe(callback: OnFn) {
    this.callbackOptions.delete(callback)
    this.callbacks.delete(callback)
  }

  toString() {
    return JSON.stringify(this.state, null, 2)
  }

  /** Update multiple values and a single callback. */
  patch(values: Partial<State>) {
    // let changed = false
    // for (const [key, value] of Object.entries(values)) {
    //   if (this.state[key] !== value) {
    //     changed = true
    //     break
    //   }
    // }
    // if (!changed) return

    const oldState = { ...this.state }
    this.patching = true
    Object.assign(this.state, values)
    this.processCallbacks(this.state, oldState)
    this.patching = false
  }
}

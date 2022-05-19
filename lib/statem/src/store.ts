// import { Statem, OnFn, CallSettings, State } from "typings.js"
// import { Statem, OnFn, CallSettings, State } from "../typings.d"

type State = Record<string, any>
type OnFn = (state: State, oldState: State) => void
interface CallOptions {
  /** Run callback only if the given key changes. */
  key?: string

  /** Run callback automatically with the subscription. */
  immediate?: boolean
}

// interface Statem<T extends object> extends T {
//   /**
//    * Allow an outside entity to subscribe to state changes with a valid callback.
//    * @returns Unsubscribe function
//    */
//   subscribe(callback: OnFn, options?: CallOptions): Fn
//   unsubscribe(callback: OnFn): void
//   // [key: keyof T]: T[key]
//   // [key: StateKey]: any
//   // [key: keyof T]: T[keyof T]
// }

// export class Store<T extends object> implements Statem<T> {
// export class Store<T extends State> {
export class Store<T extends object> {
  private state: T
  private callbacks = new Set<OnFn>()
  private callbackOptions = new Map<OnFn, CallOptions>()
  // private patching = false

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
    for (const callback of this.callbacks.values()) {
      const options = this.callbackOptions.get(callback)
      const noMutation = options && options.key && state[options.key] === oldState[options.key]
      if (noMutation) continue

      callback(state, oldState)
    }
  }

  subscribe(callback: OnFn, options?: CallOptions) {
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

  // /** Update multiple values and a single callback. */
  // patch(values: Partial<State>) {
  //   // let changed = false
  //   // for (const [key, value] of Object.entries(values)) {
  //   //   if (this.state[key] !== value) {
  //   //     changed = true
  //   //     break
  //   //   }
  //   // }
  //   // if (!changed) return

  //   const oldState = { ...this.state }
  //   this.patching = true
  //   Object.assign(this.state, values)
  //   this.processCallbacks(this.state, oldState)
  //   this.patching = false
  // }
}

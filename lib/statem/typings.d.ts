import "../../typings.d"

// declare global {
//   /** All the states. */
//   var statem: Map<string, Statem>
// }

// type StateKey = string | symbol
// type State = Record<StateKey, any>

// type OnFn = (state: State, oldState: State) => void

// interface Statem<T extends object> extends T {
//   /**
//    * Allow an outside entity to subscribe to state changes with a valid callback.
//    * @returns Unsubscribe function
//    */
//   subscribe(callback: OnFn, options?: CallSettings): Fn
//   unsubscribe(callback: OnFn): void
//   // patch(values: State): void
//   [key: keyof T]: T[key]
//   // [key: StateKey]: any
//   // [key: keyof T]: T[keyof T]
// }

// interface CallSettings {
//   /** Run callback only if the given key changes. */
//   key?: StateKey

//   /** Run callback automatically with the subscription. */
//   immediate?: boolean
// }

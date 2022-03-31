import { Store } from "./store.js"
// import { v4 as uuidv4 } from "uuid"

// export default Store
globalThis.statem = new Map()

// export function stateMake<T extends object = any>(initialState?: T | null, sid = uuidv4()) {
//   // let store: Store<T> | undefined
//   let store: Store | undefined
//   console.log("QWQE", [initialState, globalThis.statem.size])
//   if (initialState === null) {
//     console.log("DELETE!!!")
//     if (globalThis.statem.has(sid)) {
//       globalThis.statem.delete(sid)
//     }
//   } else if (globalThis.statem.has(sid)) {
//     store = globalThis.statem.get(sid)
//   } else {
//     // if (initialState === undefined) {
//     //   initialState = {}
//     // }
//     console.log("ASDASDSADSA", initialState)
//     // @ts-ignore
//     store = new Store(initialState ?? {})
//     store.sid = sid
//     globalThis.statem.set(sid, store)
//   }
//   // return store as Store<T> & T
//   return store
// }

// type sSID = { sid: string }

interface StatemConfig<T> {
  name: string
  init?: T | null | undefined
}

export function statem<T extends object>({ name, init }: StatemConfig<T>) {
  let state: Store<T> | undefined
  if (init === null) {
    globalThis.statem.delete(name)
  } else if (globalThis.statem.has(name)) {
    state = globalThis.statem.get(name)
  } else {
    state = new Store<T>(init ?? ({} as T))
    globalThis.statem.set(name, state)
  }
  return state
}

// export type { Statem } from "./store"

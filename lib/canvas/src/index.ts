// import { useSingleton } from "@depth/misc"

// const { singleton } = useSingleton()
// const store = singleton.get("rendererState")

// store.subscribe(state => {
//   console.log("state changed", state)
// })
import { useSingleton } from "@depth/misc"

export * from "./inject"
// export * from "./vue-plugin"
// export * from "./lib/helpers"
// export * from "./lib/createMesh"

export { startLooping } from "./startup"
// import { startLooping } from "./startup"
export * from "./inject"

// const { singleton } = useSingleton()
// const state = singleton.get("rendererState")

// state.subscribe(s => {
//   if (s.running) {
//     startLooping()
//     // console.log("Renderer is running")
//   }
// }

// const state =

import { acceptHMRUpdate, defineStore } from "pinia"
// import { useStorage } from "@vueuse/core"

// export const useShellStore = defineStore<"shell", LogShellState>("shell", {
//   state: () => {
//     return {
//       position: useStorage("shell.position", [0, 0, 0]),
//       turns: useStorage("shell.turns", 3.14),
//     }
//   },
// })

export const useShellStore = defineStore<"shell", LogShellState>("shell", {
  state: () => {
    return {
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1],

      a: [0, 0],
      radius: [0.5, 0.5],
      startAngle: 0,
      endAngle: 2 * Math.PI,
      clockwise: false,
      // rotation: 0,

      // position: useStorage<[number, number, number]>("shell.position", [0, 0, 0]),
      // turns: useStorage<number>("shell.turns", 3.14),
      turns: 3.14,
    }
  },
  // getters: {

  // },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShellStore, import.meta.hot))
}

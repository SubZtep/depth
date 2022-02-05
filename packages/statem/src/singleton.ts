import { reactive, ref } from "@vue/reactivity"

class Singleton {
  static instance: StatemSingleton

  constructor() {
    if (Singleton.instance) {
      return Singleton.instance
    }

    Singleton.instance = this as StatemSingleton
  }

  xxx = ref(0)

  state = new Map([
    [
      "three",
      reactive({
        isOffscreen: false,
        precision: "highp",
        antialias: true,
        powerPreference: "high-performance",
        shadowMapEnabled: true,
        shadowMapType: "PCFSoftShadowMap",
      }),
    ],
    ["player", reactive({})],
  ])

  find(key: StateKey): Statem[typeof key] | undefined {
    return this.state.get(key) as Statem[typeof key] | undefined
  }

  veto(key: StateKey, value: Statem[typeof key]) {
    this.state.set(key, value)
  }

  melt(key: StateKey, val: Statem[typeof key]) {
    const state = this.state.get(key)
    console.log("booooooooooo " + JSON.stringify([state, key, val]))
    if (state) {
      for (const [k, v] of Object.entries(val)) {
        console.log(JSON.stringify({ k, v }))
        // @ts-ignore
        state[k] = v
      }
      // this.state.set(key, { ...this.state.get(key), ...value })
      // this.tate.set(key, { ...this.state.get(key), ...value })
    }
  }

  /** Set one value */
  poke(key: StateKey, key2: string, val: Statem[typeof key]) {
    // @ts-ignore
    console.log(this.state.get(key)[key2], val)
    // @ts-ignore
    this.state.get(key)[key2] = val
    // @ts-ignore
    console.log(this.state.get(key)[key2])
  }
}

export const singleState = new Singleton()
Object.freeze(singleState)
console.log(singleState)

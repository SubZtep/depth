type Ref<T> = import("@vue/reactivity").Ref<T>
type WebGLRendererParameters = import("three").WebGLRendererParameters
type ShadowMapType = import("three").ShadowMapType
type reactive<T> = typeof import("@vue/reactivity").reactive

type StateKey = "three" | "player" //| string


interface Statem extends MapConstructor<StateKey, any> {
  // [key: StateKey]: Object
  three: reactive<ThreeState>
  player: reactive<PlayerState>
}

/** Three.js configuration */
interface ThreeState
  extends Pick<
    WebGLRendererParameters,
    "precision" | "antialias" | "powerPreference" | "depth" | "logarithmicDepthBuffer"
  > {
  precision: "highp" | "mediump" | "lowp"
  isOffscreen: boolean
  shadowMapEnabled: boolean
  shadowMapType: ShadowMapType
}

/** Player is the local user */
interface PlayerState {
  uuid: string
}

/** Container definition */
interface StatemSingleton {

  xxx: Ref<number>

  // state: Statem
  state: Map<StateKey, Statem[number]>

  /** Retreive a value from the existing state */
  find(key: StateKey): Statem[typeof key] | undefined

  /** Overwrite the existing state */
  veto(key: StateKey, value: Statem[typeof key]): void

  /** Merge the new state with the existing state */
  melt(key: StateKey, value: Statem[typeof key]): void

  /** Set one value */
  poke(key: StateKey, key2: string, value: Statem[typeof key]): void
}

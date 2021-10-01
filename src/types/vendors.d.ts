type WatchStopHandle = import("@vue/runtime-core").WatchStopHandle
type PropType<T> = import("@vue/runtime-core").PropType<T>
type MaybeRef<T> = import("@vue/runtime-core").MaybeRef<T>
type Ref<T = any> = import("@vue/reactivity").Ref<T>
type UseMediaControlsReturn = import("@vueuse/core").UseMediaControlsReturn

declare module "*SETTINGS.toml" {
  const value: import("./settings").Settings
  export default value
}

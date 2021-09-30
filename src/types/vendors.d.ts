type WatchStopHandle = import("@vue/runtime-core").WatchStopHandle
type PropType<T> = import("@vue/runtime-core").PropType<T>
type MaybeRef<T> = import("@vue/runtime-core").MaybeRef<T>
type Ref<T = any> = import("@vue/reactivity").Ref<T>
type UseMediaControlsReturn = import("@vueuse/core").UseMediaControlsReturn

declare module "*.toml" {
  const value: {
    router: Router
    sounds?: Record<string, string>
  }
  export default value
}

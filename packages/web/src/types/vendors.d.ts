type WatchStopHandle = import("vue").WatchStopHandle
type PropType<T> = import("vue").PropType<T>
type MaybeRef<T> = import("vue").MaybeRef<T>
type Ref<T = any> = import("vue").Ref<T>

declare module "*SETTINGS.toml" {
  const value: import("./settings").Settings
  export default value
}

type NormalizedLandmarkList = import("public/pose/index.d").NormalizedLandmarkList
type LandmarkList = import("public/pose/index.d").LandmarkList

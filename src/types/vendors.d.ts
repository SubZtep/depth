type WatchStopHandle = import("@vue/runtime-core").WatchStopHandle
type PropType<T> = import("@vue/runtime-core").PropType<T>
type MaybeRef<T> = import("@vue/runtime-core").MaybeRef<T>
type Ref<T = any> = import("@vue/reactivity").Ref<T>

// type { FFmpeg, ProgressCallback } = import("@ffmpeg/ffmpeg")
// type FFmpeg = import("@ffmpeg/ffmpeg").FFmpeg

// declare module "@ffmpeg/ffmpeg";

// export const FS: {
//   writeFile: (fileName: string, binaryData: Uint8Array) => void
//   readFile: (fileName: string) => Uint8Array
//   unlink: (fileName: string) => void
//   readdir: (dirName: string) => string[]
// }

// type FSMethodNames = keyof typeof FS
type UseMediaControlsReturn = import("@vueuse/core").UseMediaControlsReturn

import type { FFmpeg, CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { basename } from "~/misc/utils"
import { pngOnly, noDotFiles } from "~/misc/filters"
import { get } from "@vueuse/core"
import { VIDEO_KEYFRAME_IMAGES } from "./commands"

interface FFmpegOptions {
  src: Ref<string>
  options?: CreateFFmpegOptions
  onKeypointsReady?: () => void
}

export function useFFmpeg(options: FFmpegOptions) {
  const ffmpeg = createFFmpeg(options.options)
  const dir = "/depth/"
  const memfsSrc = () => `${dir}${basename(get(options.src))}.webm`

  /** keyframe timestamps */
  const keypoints = ref<number[]>([])

  invoke(async () => {
    try {
      await ffmpeg.load()
      // @ts-ignore
      ffmpeg.FS("mkdir", dir)
    } catch (e: any) {
      throw new Error(e.message)
    }
  })

  tryOnUnmounted(() => {
    unlinkAll()
    // @ts-ignore
    ffmpeg.FS("rmdir", dir)
    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }
  })

  watch(
    options.src,
    async (newSrc, oldSrc) => {
      const src = memfsSrc()
      if (oldSrc) {
        unlinkAll()
      }
      if (newSrc) {
        ffmpeg.FS("writeFile", src, await fetchFile(newSrc))
        await ffmpeg!.run(...VIDEO_KEYFRAME_IMAGES(memfsSrc(), dir))
        set(
          keypoints,
          ffmpeg
            // @ts-ignore
            .FS("readdir", dir)
            // @ts-ignore
            .filter(pngOnly)
            .map((file: string) => Number(file.split(".")[0]) / 1000)
        )
        options.onKeypointsReady?.call(null)
      }
    },
    { immediate: true }
  )

  const unlinkAll = () => {
    const files = ffmpeg
      // @ts-ignore
      .FS("readdir", dir)
      // @ts-ignore
      .filter(noDotFiles)
    set(keypoints, [])
    for (const file of files) {
      ffmpeg.FS("unlink", `${dir}${file}`)
    }
  }

  const getKeyframeFilename = (index: number) => `${dir}${String(index).padStart(9, "0")}.png`

  return {
    ffmpeg,
    keypoints,
    getKeyframeFilename,
  }
}

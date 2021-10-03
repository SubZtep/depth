import type { CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { basename } from "~/misc/utils"
import { pngOnly, noDotFiles } from "~/misc/filters"
import { get } from "@vueuse/core"
import { KEYFRAME_TIMESTAMPS_LOG, KEYFRAME_IMAGES, KEYFRAME_TIMESTAMPS } from "./commands"

interface FFmpegOptions {
  src: Ref<string>
  options?: CreateFFmpegOptions
}

export async function useFFmpeg(options: FFmpegOptions) {
  const ffmpeg = createFFmpeg(options.options)
  const dir = "/depth/"
  const memfsSrc = () => `${dir}${basename(get(options.src))}.webm`

  /** keyframe timestamps */
  const keypoints = ref<number[]>([])
  /** keyframe preview images */
  const thumbnails = ref<string[]>([])

  await ffmpeg.load()

  // @ts-ignore
  ffmpeg.FS("mkdir", dir)

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

  ffmpeg.setLogger(({ message }) => {
    const found = message.match(KEYFRAME_TIMESTAMPS_LOG)
    if (found === null) return
    get(keypoints).push(parseFloat(found[1]))
  })

  const { resume, pause, isActive } = pausableWatch(
    options.src,
    async newSrc => {
      pause()

      const videoSrc = memfsSrc()
      ffmpeg.FS("writeFile", videoSrc, await fetchFile(newSrc))

      await ffmpeg.run(...KEYFRAME_TIMESTAMPS(videoSrc))
      await ffmpeg.run(...KEYFRAME_IMAGES(videoSrc, dir))
      // @ts-ignore
      set(thumbnails, ffmpeg.FS("readdir", dir).filter(pngOnly))

      resume()
    },
    {
      immediate: true,
      eventFilter: invoke => get(options.src).length > 0 && invoke(),
    }
  )

  const unlinkAll = () => {
    // @ts-ignore
    const files = ffmpeg.FS("readdir", dir).filter(noDotFiles)
    set(keypoints, [])
    for (const file of files) {
      ffmpeg.FS("unlink", `${dir}${file}`)
    }
  }

  const getKeyframeFilename = (index: number) => `${dir}${String(index).padStart(9, "0")}.png`

  return {
    ffmpeg,
    running: not(isActive),
    keypoints,
    thumbnails,
    getKeyframeFilename,
  }
}

import type { CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { basename } from "~/misc/utils"
import { noDotFiles, truthyFilter } from "~/misc/filters"
import { KEYFRAME_TIMESTAMPS_LOG, KEYFRAME_TIMESTAMPS } from "./commands"

interface FFmpegOptions {
  src: Ref<string | undefined>
  options?: CreateFFmpegOptions
}

export async function useFFmpeg(options: FFmpegOptions) {
  const ffmpeg = createFFmpeg(options.options)
  await ffmpeg.load()

  const dir = "/depth/"
  // @ts-ignore
  ffmpeg.FS("mkdir", dir)

  const memfsNamer = (srcstr: string) => `${dir}${basename(srcstr)}.webm`
  const memfsSrc = computed(() => memfsNamer(get(options.src) || "fixme"))

  /** keyframe timestamps */
  const keyframes = ref<number[]>([])
  /** keyframe preview images */
  // const thumbnails = ref<string[]>([])

  const exit = () => {
    unlinkAll()
    // @ts-ignore
    ffmpeg.FS("rmdir", dir)

    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }
  }

  tryOnUnmounted(() => exit())

  ffmpeg.setLogger(({ message }) => {
    const found = message.match(KEYFRAME_TIMESTAMPS_LOG)
    if (found === null) return
    get(keyframes).push(parseFloat(found[1]))
  })

  const { resume, pause, isActive } = pausableWatch(
    options.src,
    async (newSrc, oldSrc) => {
      if (oldSrc) {
        ffmpeg.FS("unlink", memfsNamer(oldSrc))
      }
      ffmpeg.FS("writeFile", get(memfsSrc), await fetchFile(newSrc!))
    },
    {
      immediate: true,
      eventFilter: truthyFilter(options.src),
    }
  )

  const runKeyframes = async () => {
    // await until(isActive).toBeTruthy()
    pause()
    set(keyframes, [])
    await ffmpeg.run(...KEYFRAME_TIMESTAMPS(get(memfsSrc)))
    resume()
  }

  const unlinkAll = () => {
    // @ts-ignore
    const files = ffmpeg.FS("readdir", dir).filter(noDotFiles)
    set(keyframes, [])
    for (const file of files) {
      ffmpeg.FS("unlink", `${dir}${file}`)
    }
  }

  return {
    ffmpeg,
    running: not(isActive),
    runKeyframes,
    keyframes,
    // thumbnails,
    exit,
  }
}

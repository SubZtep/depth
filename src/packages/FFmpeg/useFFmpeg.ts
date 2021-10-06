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
  const memfsSrc = computed(() => `${dir}${basename(get(options.src) || "fixme")}.webm`)

  /** keyframe timestamps */
  const keyframes = ref<number[]>([])
  /** keyframe preview images */
  const thumbnails = ref<string[]>([])

  // @ts-ignore
  ffmpeg.FS("mkdir", dir)

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

  const loadVideo = async (src?: string) => {
    if (!src) return
    pause()
    ffmpeg.FS("writeFile", get(memfsSrc), await fetchFile(src))
    resume()
  }

  const { resume, pause, isActive } = pausableWatch(
    options.src,
    loadVideo,
    {
      immediate: false,
      eventFilter: truthyFilter(options.src),
    }
  )

  tryOnMounted(() => {
    if (get(options.src)) {
      loadVideo(get(options.src))
    }
  })

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
    thumbnails,
    exit,
  }
}

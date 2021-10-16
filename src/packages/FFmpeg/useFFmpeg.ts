import type { CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { noDotFiles } from "~/misc/filters"
import { basename } from "~/misc/transformers"
import { KEYFRAME_TIMESTAMPS_LOG, KEYFRAME_TIMESTAMPS } from "./commands"

interface FFmpegOptions {
  src: Ref<string>
  options?: CreateFFmpegOptions
}

export function useFFmpeg(options: FFmpegOptions) {
  const src = toRef(options, "src")
  const ffmpeg = createFFmpeg(options.options)
  const dir = "/depth/"
  const isLoaded = computed(() => ffmpeg.isLoaded())

  const memfsNamer = (srcstr: string) => `${dir}${basename(srcstr)}.webm`
  const memfsSrc = computed(() => memfsNamer(get(src)))

  /** keyframe timestamps */
  const keyframes = ref<number[]>([])

  /** keyframe preview images */
  const srcToMemfs = async (newSrc?: string, oldSrc?: string) => {
    if (get(isActive)) {
      pause()
    } else if (oldSrc && ffmpeg.isLoaded()) {
      return exit()
    } else if (!ffmpeg.isLoaded()) {
      await ffmpeg.load()
    }

    set(keyframes, [])

    if (oldSrc) {
      ffmpeg.FS("unlink", memfsNamer(oldSrc))
    }

    if (newSrc) {
      await until(isLoaded).toBe(true)
      ffmpeg.FS("writeFile", get(memfsSrc), await fetchFile(newSrc))
      await ffmpeg.run(...KEYFRAME_TIMESTAMPS(get(memfsSrc)))
    }

    resume()
  }

  const { resume, pause, isActive } = pausableWatch(src, srcToMemfs)
  pause()

  const unlinkAll = () => {
    const files = ffmpeg.FS("readdir", dir).filter(noDotFiles)
    for (const file of files) {
      ffmpeg.FS("unlink", `${dir}${file}`)
    }
  }

  const exit = () => {
    pause()
    unlinkAll()
    ffmpeg.FS("rmdir", dir)

    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }
  }

  tryOnMounted(async () => {
    await ffmpeg.load()

    ffmpeg.setLogger(({ message }) => {
      const found = message.match(KEYFRAME_TIMESTAMPS_LOG)
      if (found === null) return
      get(keyframes).push(parseFloat(found[1]))
    })

    ffmpeg.FS("mkdir", dir)

    if (get(src)) {
      srcToMemfs(get(src))
    } else {
      resume()
    }
  })

  tryOnUnmounted(() => {
    exit()
  })

  return {
    keyframes,
    isActive,
  }
}

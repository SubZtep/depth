import type { CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { get, set, until, pausableWatch, tryOnMounted, tryOnUnmounted } from "@vueuse/core"
import type { Ref } from "vue"
import { toRef, computed, ref } from "vue"
import { KEYFRAME_TIMESTAMPS_LOG, KEYFRAME_TIMESTAMPS } from "./commands"
import { noDotFiles, basename } from "@depth/misc"

export interface FFmpegOptions {
  src: Ref<string>
  options?: CreateFFmpegOptions
}

export function useFFmpeg(options: FFmpegOptions) {
  const source = toRef(options, "src")
  const ffmpeg = createFFmpeg(options.options)
  const directory = "/depth/"
  const isLoaded = computed(() => ffmpeg.isLoaded())

  const memfsNamer = (srcstr: string) => `${directory}${basename(srcstr)}.webm`
  const memfsSource = computed(() => memfsNamer(get(source)))

  /** keyframe timestamps */
  const keyframes = ref<number[]>([])

  /** keyframe preview images */
  const sourceToMemfs = async (newSource?: string, oldSource?: string) => {
    if (get(isActive)) {
      pause()
    } else if (oldSource && ffmpeg.isLoaded()) {
      return exit()
    } else if (!ffmpeg.isLoaded()) {
      await ffmpeg.load()
    }

    set(keyframes, [])

    if (oldSource) {
      ffmpeg.FS("unlink", memfsNamer(oldSource))
    }

    if (newSource) {
      await until(isLoaded).toBe(true)
      ffmpeg.FS("writeFile", get(memfsSource), await fetchFile(newSource))
      await ffmpeg.run(...KEYFRAME_TIMESTAMPS(get(memfsSource)))
    }

    resume()
  }

  const { resume, pause, isActive } = pausableWatch(source, sourceToMemfs)
  pause()

  const unlinkAll = () => {
    const files = ffmpeg.FS("readdir", directory).filter(filename => noDotFiles(filename))
    for (const file of files) {
      ffmpeg.FS("unlink", `${directory}${file}`)
    }
  }

  const exit = () => {
    pause()
    unlinkAll()
    ffmpeg.FS("rmdir", directory)

    try {
      ffmpeg.exit()
    } catch (error) {
      console.error("FFmpeg exit", error)
    }
  }

  tryOnMounted(async () => {
    await ffmpeg.load()

    ffmpeg.setLogger(({ message }) => {
      const found = message.match(KEYFRAME_TIMESTAMPS_LOG)
      if (found === null) return
      get(keyframes).push(Number.parseFloat(found[1]))
    })

    ffmpeg.FS("mkdir", directory)

    if (get(source)) {
      sourceToMemfs(get(source))
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
    exit,
  }
}

import type { ProgressCallback } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { and, tryOnUnmounted } from "@vueuse/core"
import { get, invoke, set, whenever } from "@vueuse/core"

interface FFmpegOptions {
  /** Video input file */
  src: Ref<string>

  /** Temporary name for Fetch file */
  memfsFilename?: string

  /** Video frame positions in ms. */
  pts?: number[]

  /** process progress */
  progress?: ProgressCallback
}

export function useFFmpeg(options: FFmpegOptions) {
  const {
    src,
    memfsFilename = "test.webm",
    pts,
    progress
  } = options

  const ffmpeg = createFFmpeg({
    log: false,
    progress,
  })

  const loaded = ref(false)
  const fetched = ref(false)

  invoke(async () => {
    await ffmpeg.load()
    if (!ffmpeg.isLoaded()) {
      throw new Error("FFmpeg is not loaded")
    }
    set(loaded, true)
  })


  whenever(and(loaded, src), async () => {
    set(fetched, false)
    ffmpeg.FS("writeFile", memfsFilename, await fetchFile(get(src)))
    set(fetched, true)
  }, { immediate: true })

  whenever(and(fetched, pts), async () => {
    ffmpeg.setLogger(({ message }) => {
      const found = message.match(/^.*pts_time:((([1-9][0-9]*)|(0))(?:\.[0-9]+))\s.*$/)
      found !== null && pts!.push(+found[1])
    })
    await ffmpeg.run(...`-i ${memfsFilename} -vf showinfo -vsync 0 -start_number 0 -f null /dev/null`.split(" "))
  })

  tryOnUnmounted(() => {
    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }
  })
}

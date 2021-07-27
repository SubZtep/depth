import type { MaybeRef } from "@vueuse/core"
import type { ProgressCallback } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { get, invoke, set, whenever, and, tryOnUnmounted } from "@vueuse/core"

interface FFmpegOptions {
  /** Video input file */
  src: MaybeRef<string>

  /** Temporary name for Fetch file */
  memfsFilename?: string

  /** Video frame positions in ms. */
  // pts?: number[]

  onTimestamp: (pts: number) => void

  onStart?: Fn
  onStarted?: Fn
  onDone?: Fn

  /** process progress */
  progress?: ProgressCallback

  logger?: Logger

  log?: boolean
}

export function useFFmpeg(options: FFmpegOptions) {
  const {
    src,
    memfsFilename = "test.webm",
    // pts,
    onTimestamp,
    onStart,
    onDone,
    progress,
    logger = console,
    log = false,
  } = options

  const ffmpeg = createFFmpeg({
    log,
    progress,
  })

  const loaded = ref(false)
  const fetched = ref(false)

  invoke(async () => {
    try {
      await ffmpeg.load()
    } catch (e) {
      logger.error(e.message)
    }
    if (!ffmpeg.isLoaded()) {
      logger.error("FFmpeg is not loaded")
    }
    set(loaded, true)
  })

  whenever(
    and(loaded, src),
    async () => {
      set(fetched, false)
      ffmpeg.FS("writeFile", memfsFilename, await fetchFile(get(src)))
      logger.info(`File ${memfsFilename} loaded into FFmpeg`)
      set(fetched, true)
    },
    { immediate: true }
  )

  whenever(fetched, async () => {
    ffmpeg.setLogger(({ message }) => {
      const found = message.match(/^.*pts_time:((([1-9][0-9]*)|(0))(?:\.[0-9]+))\s.*$/)
      if (found !== null) {
        onTimestamp.call(null, parseFloat(found[1]))

        if (options.onStarted) {
          options.onStarted.call(null)
          options.onStarted = undefined
        }
      }
    })
    onStart?.call(null)
    await ffmpeg.run(...`-i ${memfsFilename} -vf showinfo -vsync 0 -start_number 0 -f null /dev/null`.split(" "))
    onDone?.call(null)
  })

  tryOnUnmounted(() => {
    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }
  })
}

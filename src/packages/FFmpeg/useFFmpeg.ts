import type { ProgressCallback } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

interface FFmpegOptions {
  /** Video input file */
  src: MaybeRef<string>

  /** Temporary name for Fetch file */
  memfsFilename?: string

  /** process progress */
  progress?: ProgressCallback

  logger?: Logger

  log?: boolean

  processFrame?: (pts: number) => void
}

interface PtsOptions {
  onTimestamp: (pts: number) => void
  onStarted?: Fn
  onDone?: Fn
}

export function useFFmpeg(options: FFmpegOptions) {
  const { src, memfsFilename = "test.webm", progress, logger = console, log = false } = options

  const ffmpeg = createFFmpeg({
    log,
    progress,
  })

  const loaded = ref(false)
  const fetched = ref(false)

  invoke(async () => {
    try {
      await ffmpeg.load()
    } catch (e: any) {
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
      logger.info(`File ${get(src)} loaded into FFmpeg`)
      set(fetched, true)
    },
    { immediate: true }
  )

  tryOnUnmounted(() => {
    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }
  })

  const presentationTimestamps = ({ onTimestamp, onStarted, onDone }: PtsOptions) => {
    ffmpeg.setLogger(({ message }) => {
      const found = message.match(/^.*pts_time:((([1-9][0-9]*)|(0))(?:\.[0-9]+))\s.*$/)
      if (found != null) {
        onTimestamp.call(null, parseFloat(found[1]))
        if (onStarted !== undefined) {
          onStarted.call(null)
          onStarted = undefined
        }
      }
    })
    whenever(fetched, async () => {
      await ffmpeg.run(...`-i ${memfsFilename} -vf showinfo -vsync 0 -start_number 0 -f null /dev/null`.split(" "))
      onDone?.call(null)
    })
  }

  const keyframeImages = () => {
    const files = reactive<string[]>([])
    whenever(fetched, async () => {
      await ffmpeg.run(..."-skip_frame nokey -i test.webm -vsync 0 -r 1000 -frame_pts 1 %09d.png".split(" "))
      // @ts-ignore
      Object.assign(files, ffmpeg.FS<"readdir">("readdir", "/"))
    })
    return { files }
  }

  return {
    presentationTimestamps,
    keyframeImages,
  }
}

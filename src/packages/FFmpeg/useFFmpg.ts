import type { FFmpeg, ProgressCallback } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

interface FFmpegOptions {
  progress?: ProgressCallback
  log?: boolean
}

interface FFVideo {
  src?: string
  /** Video filename in MEMFS */
  memfsFilename?: string
  frameTimes?: number[]
  imageMemfsFilenames?: string[]
}

function pngOnly(filename: string) {
  return filename.endsWith(".png")
}

/** find pts (presentation time stamp) in ffmpeg output */
function findPtsInLogRow(frameTimes: number[]) {
  return ({ message }) => {
    const found = message.match(/^.*pts_time:((([1-9][0-9]*)|(0))(?:\.[0-9]+))\s.*$/)
    found && frameTimes.push(parseFloat(found[1]))
  }
}

const VIDEO_KEYFRAME_TIMESTAMPS = (memfsFilename: string) => `-i ${memfsFilename} -vf showinfo -vsync 0 -start_number 0 -f null /dev/null`.split(" ")
const VIDEO_KEYFRAME_IMAGES = (memfsFilename: string) => `-skip_frame nokey -i ${memfsFilename} -vsync 0 -r 1000 -frame_pts 1 %09d.png`.split(" ")

export function useFFmpeg(options: FFmpegOptions) {
  const { progress, log = false } = options
  let ffmpeg: FFmpeg

  /** Video in MEMFS */
  const video = reactive<FFVideo>({})

  tryOnMounted(async () => {
    ffmpeg = createFFmpeg({ log, progress })
    try {
      await ffmpeg.load()
    } catch (e: any) {
      throw new Error(e.message)
    }
    if (!ffmpeg.isLoaded()) {
      throw new Error("FFmpeg is not loaded")
    }
  })

  tryOnUnmounted(() => {
    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
    }
  })

  /** Upload file on given source to MEMFS */
  const writeToMemfs = async (src: string) => {
    const fn = `${src.split("/").pop()}.webm`
    ffmpeg.FS<"writeFile">("writeFile", fn, await fetchFile(src))
    video.src = src
    video.memfsFilename = fn
  }

  /** Unlink file from MEMFS */
  const delFromMemfs = () => {
    if (video.memfsFilename) {
      ffmpeg.FS<"unlink">("unlink", video.memfsFilename)
      delete video.memfsFilename
      delete video.src
      delete video.frameTimes
    }
  }

  /** Get each frame's timestamp */
  const frameTimestamps = async () => {
    if (!video.memfsFilename) throw new Error("No file in MEMFS")

    const frameTimes: number[] = []
    ffmpeg.setLogger(findPtsInLogRow(frameTimes))

    await ffmpeg.run(...VIDEO_KEYFRAME_TIMESTAMPS(video.memfsFilename))
    // video.frameTimes = frameTimes.length > 0 && [...new Set(frameTimes)] || undefined // FIXME: duplicates, but maybe not XP
    frameTimes.length > 0 && (video.frameTimes = frameTimes)
  }

  const frameImages = async () => {
    if (!video.memfsFilename) throw new Error("No file in MEMFS")

    await ffmpeg.run(...VIDEO_KEYFRAME_IMAGES(video.memfsFilename))
    // @ts-ignore
    const pngs = ffmpeg.FS<"readdir">("readdir", "/").filter(pngOnly)
    pngs.length > 0 && (video.imageMemfsFilenames = pngs)
  }

  const delImagesFromMemfs = () => {
    if (!video.imageMemfsFilenames) throw new Error("No images in MEMFS")
    for (const fn of video.imageMemfsFilenames) {
      ffmpeg.FS<"unlink">("unlink", fn)
    }
    delete video.imageMemfsFilenames
  }

  return {
    video,
    memfs: {
      writeVideo: writeToMemfs,
      delVideo: delFromMemfs,
      delImages: delImagesFromMemfs,
    },
    frameTimestamps,
    frameImages,
  }
}

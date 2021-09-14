import type { FFmpeg, ProgressCallback } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { VIDEO_KEYFRAME_TIMESTAMPS, VIDEO_KEYFRAME_IMAGES } from "./commands"
import { pngOnly } from "../../misc/utils"

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

/** find pts (presentation time stamp) in ffmpeg output */
function findPtsInLogRow(frameTimes: number[]) {
  return ({ message }) => {
    const found = message.match(/^.*pts_time:((([1-9][0-9]*)|(0))(?:\.[0-9]+))\s.*$/)
    found && frameTimes.push(parseFloat(found[1]))
  }
}

export function useFFmpeg(options: FFmpegOptions) {
  const { progress, log = false } = options
  let ffmpeg: FFmpeg

  /** Video in MEMFS */
  // const video = reactive<FFVideo>({})
  const video = reactive<FFVideo>({
    "src": "/videos/happy.webm",
    "memfsFilename": "happy.webm.webm",
    "frameTimes": [
      0.003,
      0.045,
      0.086,
      0.128,
      0.17,
      0.212,
      0.253,
      0.295,
      0.337,
      0.378,
      0.42,
      0.462,
      0.504,
      0.545,
      0.587,
      0.629,
      0.67,
      0.712,
      0.754,
      0.795,
      0.837,
      0.879,
      0.921,
      0.962,
      1.004,
      1.046,
      1.087,
      1.129,
      1.171,
      1.213,
      1.254,
      1.296,
      1.338,
      1.379,
      1.421,
      1.463,
      1.505,
      1.546,
      1.588,
      1.63,
      1.671,
      1.713,
      1.755,
      1.796,
      1.838,
      1.88,
      1.922,
      1.963,
      2.005,
      2.047,
      2.088,
      2.13,
      2.172,
      2.214,
      2.255,
      2.297,
      2.339,
      2.38,
      2.422,
      2.464,
      2.506,
      2.547,
      2.589,
      2.631,
      2.672,
      2.714,
      2.756,
      2.797,
      2.839,
      2.881,
      2.923,
      2.964,
      3.006,
      3.048,
      3.089,
      3.131,
      3.173,
      3.215,
      3.256,
      3.298,
      3.34,
      3.381,
      3.423,
      3.465,
      3.507,
      3.548,
      3.59,
      3.632,
      3.673,
      3.715,
      3.757,
      3.798,
      3.84,
      3.882,
      3.924,
      3.965,
      4.007,
      4.049,
      4.09,
      4.132,
      4.174,
      4.216,
      4.257,
      4.299,
      4.341,
      4.382,
      4.424,
      4.466,
      4.508,
      4.549,
      4.591,
      4.633,
      4.674,
      4.716,
      4.758,
      4.799,
      4.841,
      4.883,
      4.925,
      4.966
    ]
  })

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
  const writeToMemfs = async (src: string, ext = "webm") => {
    const fn = `${src.split("/").pop()}.${ext}`
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

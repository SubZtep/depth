import type { FFmpeg, CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { VIDEO_KEYFRAME_TIMESTAMPS, VIDEO_KEYFRAME_IMAGES } from "./commands"
import { pngOnly, basename } from "~/misc/utils"

interface FFmpegOptions {
  src: string
  ffOpts: CreateFFmpegOptions
  // onUpdated?: (ffmpeg: FFmpeg) => void
}

interface FFVideo {
  src?: string
  /** Video filename in MEMFS */
  memfsFilename?: string
  frameTimes?: number[]
  imageMemfsFilenames?: string[]
}

interface FFreturns {
  ffmpeg?: FFmpeg
  video: FFVideo
  writeToMemfs: (src: string, ext?: string) => void,
  delVideo: () => void,
  delImages: () => void,
  frameTimestamps: () => Promise<void>,
  frameImages: () => Promise<void>,
}

/** find pts (presentation time stamp) in ffmpeg output */
function findPtsInLogRow(frameTimes: number[]) {
  return ({ message }) => {
    const found = message.match(/^.*pts_time:((([1-9][0-9]*)|(0))(?:\.[0-9]+))\s.*$/)
    found && frameTimes.push(parseFloat(found[1]))
  }
}

export function useFFmpeg(options: FFmpegOptions): FFreturns {
  const { ffOpts, src } = options
  const ffmpeg = createFFmpeg(ffOpts)

  const files = ref<string[]>([])

  invoke(async () => {
    try {
      await ffmpeg.load()
    } catch (e: any) {
      throw new Error(e.message)
    }
  })

  // invoke(async () => {
  //   const fn = basename(src, "webm")
  //   ffmpeg.FS("writeFile", fn, await fetchFile(src))
  //   await ffmpeg.run(...VIDEO_KEYFRAME_IMAGES(fn))
  //   // @ts-ignore
  //   files.value = ffmpeg.FS<"readdir">("readdir", "/")
  // })

  tryOnUnmounted(() => {
    try {
      ffmpeg.exit()
    } catch (e: any) {
      console.error("FFmpeg exit", e.message)
    }
  })

  /** Get each frame's timestamp */
  const frameTimestamps = async () => {
    if (!video.memfsFilename) throw new Error("No file in MEMFS")

    const frameTimes: number[] = []
    ffmpeg!.setLogger(findPtsInLogRow(frameTimes))

    await ffmpeg!.run(...VIDEO_KEYFRAME_TIMESTAMPS(video.memfsFilename))
    // video.frameTimes = frameTimes.length > 0 && [...new Set(frameTimes)] || undefined // FIXME: duplicates, but maybe not XP
    frameTimes.length > 0 && (video.frameTimes = frameTimes)
  }

  const grabKeyframeImages = async (memfsFilename: string) => {
    await ffmpeg!.run(...VIDEO_KEYFRAME_IMAGES(memfsFilename))
  }

  const frameImages = async () => {
    if (!video.memfsFilename) throw new Error("No file in MEMFS")

    await ffmpeg!.run(...VIDEO_KEYFRAME_IMAGES(video.memfsFilename))
    // @ts-ignore
    const pngs = ffmpeg.FS<"readdir">("readdir", "/").filter(pngOnly)
    pngs.length > 0 && (video.imageMemfsFilenames = pngs)
  }

  /** Upload file on given source to MEMFS */
  const writeToMemfs = async (src: string, ext = "webm") => {
    const fn = basename(src, ext)
    FS("writeFile", fn, await fetchFile(src))
    video.src = src
    video.memfsFilename = fn
  }

  /** Unlink file from MEMFS */
  const delFromMemfs = () => {
    if (video.memfsFilename) {
      FS<"unlink">("unlink", video.memfsFilename)
      delete video.memfsFilename
      delete video.src
      delete video.frameTimes
    }
  }

  const delImagesFromMemfs = () => {
    if (!video.imageMemfsFilenames) throw new Error("No images in MEMFS")
    for (const fn of video.imageMemfsFilenames) {
      ffmpeg!.FS<"unlink">("unlink", fn)
    }
    delete video.imageMemfsFilenames
  }

  return {
    // ffmpeg: ffmpeg!,
    ffmpeg,
    video,
    writeToMemfs,
    delFromMemfs,
    delImagesFromMemfs,
    frameTimestamps,
    frameImages,
  }
}

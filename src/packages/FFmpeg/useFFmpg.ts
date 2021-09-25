import type { FFmpeg, CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { VIDEO_KEYFRAME_TIMESTAMPS, VIDEO_KEYFRAME_IMAGES } from "./commands"
import { pngOnly, basename } from "~/misc/utils"

interface FFmpegOptions {
  src: string
  ffOpts: CreateFFmpegOptions
  // onUpdated?: (ffmpeg: FFmpeg) => void
}

interface FFreturns {
  ffmpeg?: FFmpeg
  video: FFVideo
  // memfs: {
  //   writeVideo: (src: string, ext?: string) => void,
  //   delVideo: () => void,
  //   delImages: () => void,
  // },
  // frameTimestamps: () => Promise<void>,
  // frameImages: () => Promise<void>,
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
    } catch (e) {
      throw new Error(e.message)
    }
  })

  invoke(async () => {
    const fn = basename(src, "webm")
    ffmpeg.FS("writeFile", fn, await fetchFile(src))
    await ffmpeg.run(...VIDEO_KEYFRAME_IMAGES(fn))
    // @ts-ignore
    files.value = ffmpeg.FS<"readdir">("readdir", "/")


  })

  tryOnUnmounted(() => {
    try {
      ffmpeg.exit()
    } catch (e) {
      console.error("FFmpeg exit", e)
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

  return {
    // ffmpeg: ffmpeg!,
    ffmpeg,
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

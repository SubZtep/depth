import type { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/ffmpeg"
import { basename } from "~/misc/utils"

interface FFVideo {
  src?: string
  /** Video filename in MEMFS */
  memfsFilename?: string
  frameTimes?: number[]
  imageMemfsFilenames?: string[]
}

interface MemfsOptions {
  FS: FFmpeg["FS"]
}

interface MemfsReturns {
  files: Ref<string[]>
}

export function useMemfs(options: MemfsOptions): MemfsReturns {
  const { FS } = options

  const files = ref<string[]>([])

  const updateFiles = () => {
    // @ts-ignore
    files.value = FS<"readdir">("readdir", "/")
  }

  /** Video in MEMFS */
  const video = reactive<FFVideo>({})

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
    files,
  }
}

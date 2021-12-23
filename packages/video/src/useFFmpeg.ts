import type { CreateFFmpegOptions } from "@ffmpeg/ffmpeg"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { tryOnScopeDispose } from "@vueuse/core"
import type { Ref } from "vue"
import { ref, toRef, watch } from "vue"

interface Options {
  src: Ref<string>
  memfsDirectory?: string
  memfsFilename?: string
  options?: CreateFFmpegOptions
}

export async function useFFmpeg(options: Options) {
  const { memfsDirectory = "/depth", memfsFilename = "video.webm" } = options
  const memfsPath = `${memfsDirectory}/${memfsFilename}`

  const src = toRef(options, "src")
  const ff = createFFmpeg(options.options)
  await ff.load()
  ff.FS("mkdir", memfsDirectory)
  const files = ref<string[]>([])

  const refreshFiles = () => {
    files.value = ff.FS("readdir", memfsDirectory)
  }

  const unlinkAll = () => {
    refreshFiles()
    for (const file of files.value.filter(filename => ![".", ".."].includes(filename))) {
      ff.FS("unlink", `${memfsDirectory}/${file}`)
    }
    refreshFiles()
  }

  const generateThumbnails = async (height = 66) => {
    await ff.run(
      ...`-skip_frame nokey -i ${memfsDirectory}/${memfsFilename} -vf scale=-1:${height} -vsync 0 -r 1000 -frame_pts 1 ${memfsDirectory}/%09d.png`.split(
        " "
      )
    )
    refreshFiles()
  }

  watch(
    src,
    async (newSrc, oldSrc) => {
      if (oldSrc) {
        unlinkAll()
      }
      if (newSrc) {
        ff.FS("writeFile", memfsPath, await fetchFile(newSrc))
      }
      refreshFiles()
    },
    { immediate: true }
  )

  tryOnScopeDispose(() => {
    unlinkAll()
    files.value = []
    ff.FS("rmdir", memfsDirectory)
    try {
      ff.exit()
    } catch (error: any) {
      console.error("Exit FFmpeg", error)
    }
  })

  return {
    ff,
    files,
    generateThumbnails,
  }
}

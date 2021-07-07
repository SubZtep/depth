import { createFFmpeg } from "@ffmpeg/ffmpeg"

export function useFFmpeg() {
  const ffmpeg = createFFmpeg({ log: true })

  return {}
}

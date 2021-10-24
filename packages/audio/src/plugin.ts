import type { Plugin } from "vue"
import { onAudioPlayable } from "./autoplay"
import { playUrl } from "./audio"

let play = async (src: string) => {
  console.warn("Audio context is suspended", src)
  return Promise.resolve()
}

export const AudioPlugin: Plugin = function () {
  onAudioPlayable(() => {
    play = playUrl
  })
}

export function useAudio() {
  return {
    play,
  }
}

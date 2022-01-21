// import type { Plugin } from "vue"
import { onAudioPlayable } from "./autoplay"
import { playUrl } from "./audio"

interface AudioPluginOptions {
  volume?: number
  samples: any // AudioSample
}

let play = async (src: string) => {
  console.warn("Audio context is suspended", src)
  return
}

const plugin = {
  install(_, _options?: AudioPluginOptions) {
    onAudioPlayable(() => {
      play = playUrl
    })
  },
}

export default plugin

export function useAudio() {
  return {
    play,
  }
}

import type { Plugin } from "vue"
import { onAudioPlayable } from "./autoplay"
import { playUrl } from "./audio"

let play = async (src: string) => {
  console.warn("Audio context is suspended", src)
  return Promise.resolve()
}

const plugin: Plugin = {
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

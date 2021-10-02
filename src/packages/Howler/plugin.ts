import type { Plugin } from "vue"
import { Howl, Howler } from "howler"

type HowlerSounds = {
  [key in string]: string
}

type HowlerOptions = {
  volume?: number
  samples: HowlerSounds
}

type PlaySound = (sound: keyof HowlerSounds) => void

const howlerKey = Symbol("HowlerSounds")
const players = new Map<keyof HowlerSounds, Howl>()

const plugin: Plugin = {
  install(app, options: HowlerOptions) {
    if (options.volume !== undefined) {
      Howler.volume(options.volume)
    }

    const playSound: PlaySound = sound => {
      if (!players.has(sound)) {
        players.set(sound, new Howl({ src: options.samples[sound] }))
      }
      players.get(sound)?.play()
    }

    const ctx = new AudioContext()

    const resumeAudioContext = async () => {
      ctx.resume()
    }

    if (ctx.state === "suspended") {
      // https://goo.gl/7K7WLu
      console.warn("Audio context is suspended")

      document.addEventListener("click", resumeAudioContext, { once: true })
      document.addEventListener("keypress", resumeAudioContext, { once: true })

      ctx.addEventListener(
        "statechange",
        async () => {
          document.removeEventListener("click", resumeAudioContext)
          document.removeEventListener("keypress", resumeAudioContext)
          console.info("Audio context state changed 🎧", ctx.state)
          await ctx.close()
          app.provide(howlerKey, playSound)
        },
        { once: true }
      )
    } else {
      app.provide(howlerKey, playSound)
    }
  },
}

export default plugin

export function useHowler(log?: (msg: string) => void): PlaySound {
  const player = inject<PlaySound>(howlerKey)
  if (player === undefined) {
    return () => {
      const msg = "no sound, run audio context"
      if (log) {
        log(msg)
      } else {
        throw new Error("no sound, run audio context")
      }
    }
  }
  return player
}

import type { Plugin } from "vue"
import { Howl, Howler } from "howler"
// import sounds from "~/../public/sounds.json"

type HowlerSounds = {
  [key in string]: string
}

type HowlerOptions = {
  sounds: HowlerSounds
}

type PlaySound = (sound: keyof HowlerSounds) => void

const howlerKey = Symbol("Howler sounds")
const players = new Map<keyof HowlerSounds, Howl>()

const plugin: Plugin = {
  install(app, { sounds }: HowlerOptions) {
    Howler.volume(0.45)

    const playSound: PlaySound = sound => {
      if (!players.has(sound)) {
        players.set(sound, new Howl({ src: sounds[sound] }))
      }
      players.get(sound)?.play()
    }

    const ctx = new AudioContext()
    if (ctx.state === "suspended") {
      // https://goo.gl/7K7WLu
      console.warn("Audio context is suspended")

      document.addEventListener(
        "click",
        () => {
          ctx.resume()
        },
        { once: true }
      )

      ctx.addEventListener(
        "statechange",
        async () => {
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

export function useHowler() {
  const player = inject<PlaySound>(howlerKey)
  if (player === undefined) {
    console.warn("Howler plugin is not installed properly")
    return () => {
      // FIXME: once context state is running, replace with sound player function
      throw new Error("no sound, run audio context")
    }
  }
  return player
}

import type { Plugin } from "vue"
import { Howl, Howler } from "howler"
import sounds from "~/../public/sounds.json"

type SoundEffect = keyof typeof sounds
const howlerKey = Symbol("Howler sounds")
const players = new Map<SoundEffect, Howl>()

function playSound(sound: SoundEffect) {
  if (!players.has(sound)) {
    players.set(sound, new Howl({ src: sounds[sound] }))
  }
  players.get(sound)?.play()
}

const plugin: Plugin = {
  install(app) {
    Howler.volume(0.45)

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
  const player = inject<typeof playSound>(howlerKey)
  if (player === undefined) {
    console.warn("Howler plugin is not installed properly")
    return () => {
      // FIXME: once context state is running, replace with sound player function
      throw new Error("no sound, run audio context")
    }
  }
  return player
}

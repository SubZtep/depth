// sound autoplay policy https://goo.gl/7K7WLu

export function onAudioPlayable(cb: () => void) {
  const ctx = new AudioContext()

  const resumeAudioContext = async () => {
    ctx.resume()
  }

  if (ctx.state === "suspended") {
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

        // GOOGOGO
        cb.call(null)
      },
      { once: true }
    )
  } else if (ctx.state === "running") {
    cb.call(null)
  }
}

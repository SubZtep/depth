// sound autoplay policy https://goo.gl/7K7WLu

export function onAudioPlayable(callback: () => void) {
  const context = new AudioContext()

  const resumeAudioContext = async () => {
    context.resume()
  }

  if (context.state === "suspended") {
    console.warn("Audio context is suspended")

    document.addEventListener("click", resumeAudioContext, { once: true })
    document.addEventListener("keypress", resumeAudioContext, { once: true })

    context.addEventListener(
      "statechange",
      async () => {
        document.removeEventListener("click", resumeAudioContext)
        document.removeEventListener("keypress", resumeAudioContext)
        console.info("Audio context state changed 🎧", context.state)
        await context.close()

        // GOOGOGO
        callback.call(null)
      },
      { once: true }
    )
  } else if (context.state === "running") {
    callback.call(null)
  }
}

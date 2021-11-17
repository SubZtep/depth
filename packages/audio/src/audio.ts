export async function playUrl(url: string) {
  const context = new AudioContext()
  const source = context.createBufferSource()
  const audioBuffer = await fetch(url)
    .then(response => response.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer))

  source.buffer = audioBuffer
  source.connect(context.destination)
  source.start()
}

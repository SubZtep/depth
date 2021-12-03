type AudioSample = {
  [key in string]: string
}

interface AudioPluginOptions {
  volume?: number
  samples: AudioSample
}

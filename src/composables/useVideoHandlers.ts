import { videoClipSelectOptions } from "~/misc/constants"
import { basename } from "~/misc/utils"
import { VideoState } from "~/stores/video"

interface VideoHandlers {
  videoState: VideoState
}

export default function useVideoHandlers(params: VideoHandlers, logger?: Logger) {
  const { videoState } = params

  const videoSelectOptions: Ref<SelectOptions> = ref(videoClipSelectOptions)

  const setAttributes = ({ target }: Event) => {
    const { videoWidth, videoHeight, duration } = target as HTMLVideoElement
    videoState.width = videoWidth
    videoState.height = videoHeight
    videoState.duration = duration
  }

  const loadError = (ev: Event) => {
    const videoEl = ev.target as HTMLVideoElement
    logger?.error(videoEl.error!.message)
    delete get(videoSelectOptions)[basename(videoEl.src)]
    videoEl.removeAttribute("src")
  }

  return {
    videoSelectOptions,
    setAttributes,
    loadError,
  }
}

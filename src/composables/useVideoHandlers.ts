import { videoClipSelectOptions } from "~/misc/constants"
import { basename } from "~/misc/utils"
import { VideoState } from "~/stores/video"

interface VideoHandlers {
  videoState: VideoState
}

/** Event handlers */
export default function useVideoHandlers({ videoState }: VideoHandlers, logger?: Logger) {

  /** timeupdate event (should) change it */
  const playerTimeUpdated = ref(false)

  /** Available video files in gui-friendly format */
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

  const playerTimeUpdater = () => {
    set(playerTimeUpdated, true)
    // console.log("TU", e.target.currentTime)
  }

  return {
    playerTimeUpdater,
    playerTimeUpdated,
    videoSelectOptions,
    setAttributes,
    loadError,
  }
}

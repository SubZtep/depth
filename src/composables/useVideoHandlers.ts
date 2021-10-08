import { useVideoStore } from "~/stores/video"

interface Params {
  onError?: (src: string) => void
  logger?: Logger
}

/** Event handlers */
export default function useVideoHandlers({ onError, logger }: Params) {
  const videoStore = useVideoStore()

  /** timeupdate event (should) change it */
  const playerTimeUpdated = ref(false)

  const setAttributes = ({ target }: VideoElementEvent) => {
    videoStore.width = target.videoHeight
    videoStore.height = target.videoHeight
    videoStore.duration = target.duration
  }

  const loadError = (({ target }: VideoElementEvent) => {
    onError?.call(null, target.src)
    target.removeAttribute("src")
    logger?.error(target.error!.message)
  })

  const playerTimeUpdater = () => {
    set(playerTimeUpdated, true)
    // console.log("TU", e.target.currentTime)
  }

  return {
    playerTimeUpdater,
    playerTimeUpdated,
    setAttributes,
    loadError,
  }
}

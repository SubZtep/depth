import { watch } from "fs"
import { useGlobalState } from "../store"

export function useResponsivity() {
  const state = useGlobalState()

  // watch(
  //   () => state.piles.find(v => v.id === elId)?.videoPlayer.width,
  //   newWidth => {
  //     const { videoWidth, videoHeight } = el
  //     const ratio = videoWidth / videoHeight
  //     console.log({ videoWidth, videoHeight, ratio })
  //   }
  // )
  // biSyncRef
  return {}
}

import { computed } from "vue"
import { useDevicesList, useUserMedia, get, set } from "@vueuse/core"
import { normalizeDeviceLabel } from "../misc/utils"

const { videoInputs, permissionGranted } = useDevicesList({ requestPermissions: true })

export function useWebCam() {
  const {
    stream,
    stop: stopWebcam,
    start: startWebcam,
    videoDeviceId,
    enabled: webcamEnabled,
  } = useUserMedia({
    audioDeviceId: false,
    enabled: false,
  })

  const hasWebcam = computed(() => get(permissionGranted) && get(videoInputs).length > 0)

  if (get(hasWebcam)) {
    set(videoDeviceId, get(videoInputs)[0].deviceId)
  }

  const webcams = computed(() =>
    Object.fromEntries(get(videoInputs).map(input => [normalizeDeviceLabel(input.label), input.deviceId]))
  )

  return {
    hasWebcam,
    videoDeviceId,
    videoInputs,
    stream,
    startWebcam,
    stopWebcam,
    webcamEnabled,
    webcams,
  }
}

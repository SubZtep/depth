import type { Ref } from "vue"
import { onMounted, watch, toRef } from "vue"
import { useUserMedia, useDocumentVisibility, get, createEventHook, syncRef } from "@vueuse/core"

export function useWebCam(videoRef: Ref<HTMLVideoElement | undefined>, components: ComponentTogglers) {
  const { stream, enabled, stop, start } = useUserMedia({ enabled: false, audioDeviceId: false })

  const visibility = useDocumentVisibility()
  const streaming = createEventHook<MediaTrackSettings>()

  onMounted(() => {
    syncRef(toRef(components, "webcam"), enabled)
  })

  watch(stream, newStream => {
    get(videoRef)!.srcObject = newStream || null
    if (newStream) {
      const meset: MediaTrackSettings = newStream.getVideoTracks()[0].getSettings()
      components.videoPreview && console.table(meset)
      if (meset.deviceId) {
        components.videoDeviceId = meset.deviceId
      }
      streaming.trigger(meset)
    }
  })

  watch(visibility, async newVisibility => {
    if (newVisibility === "visible") {
      if (components.webcam) {
        await start()
      }
    } else {
      stop()
    }
  })

  return {
    onVideoStream: streaming.on,
  }
}

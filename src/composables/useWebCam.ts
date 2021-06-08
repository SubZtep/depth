import type { Ref } from "vue"
import { useIdle } from '@vueuse/core'
import { onMounted, watch, toRef } from "vue"
import { useUserMedia, useDocumentVisibility, get, createEventHook, syncRef } from "@vueuse/core"

export function useWebCam(videoRef: Ref<HTMLVideoElement | undefined>, togglers: ComponentTogglers) {
  const { stream, enabled, stop, start } = useUserMedia({ enabled: false, audioDeviceId: false })
  const streaming = createEventHook<MediaTrackSettings>()
  const visibility = useDocumentVisibility()
  const { idle } = useIdle()

  onMounted(() => {
    syncRef(toRef(togglers, "webcam"), enabled)
  })

  watch(stream, newStream => {
    get(videoRef)!.srcObject = newStream || null
    if (newStream) {
      const mediaset: MediaTrackSettings = newStream.getVideoTracks()[0].getSettings()
      togglers.videoPreview && console.table(mediaset)
      if (mediaset.deviceId) {
        togglers.videoDeviceId = mediaset.deviceId
      }
      streaming.trigger(mediaset)
    }
  })

  watch(visibility, async newVisibility => {
    if (newVisibility === "visible") {
      if (togglers.webcam) {
        await start()
      }
    } else {
      stop()
    }
  })

  const stopIdleWatch = watch(idle, idled => {
    if (idled && get(visibility) === "visible") {
      stopIdleWatch()
      togglers.webcam = true
      // FIXME: should stop idle watch? (how?)
    }
  })

  return {
    onVideoStream: streaming.on,
  }
}

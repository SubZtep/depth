import type { Ref } from "vue"
import { onMounted, watch } from "vue"
import { useUserMedia, useDocumentVisibility, get, syncRef, createEventHook } from "@vueuse/core"

export function useCam(videoRef: Ref<HTMLVideoElement | undefined>, camOn: Ref<boolean>) {
  const { stream, enabled } = useUserMedia({ enabled: false, audioDeviceId: false })
  const visibility = useDocumentVisibility()
  const streaming = createEventHook<MediaTrackSettings>()

  onMounted(() => {
    syncRef(camOn, enabled)
  })

  watch(stream, newStream => {
    get(videoRef)!.srcObject = newStream || null
    if (newStream) {
      streaming.trigger(newStream.getVideoTracks()[0].getSettings())
    }
  })

  watch(visibility, newVisibility => (enabled.value = get(camOn) && newVisibility === "visible"))

  return {
    stream,
    enabled,
    onStream: streaming.on,
  }
}

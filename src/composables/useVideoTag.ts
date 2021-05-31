import type { Ref } from "vue"
import { ref, onMounted, onBeforeUnmount } from "vue"
import { createEventHook } from "@vueuse/core"

export function useVideoTag() {
  let el: Ref<HTMLVideoElement | undefined> = ref()
  const loadedData = createEventHook<any>()

  onMounted(() => {
    const video = document.createElement("video")
    video.playsInline = true
    video.muted = true
    video.controls = false
    video.autoplay = true
    video.style.position = "absolute"
    video.style.opacity = "0"
    document.body.appendChild(video)
    video.addEventListener("loadeddata", () => {
      loadedData.trigger({})
    })
    el.value = video
  })

  onBeforeUnmount(() => {
    if (el.value) {
      el.value.pause()
      //FIXME: unref or something?
    }
  })

  return {
    el,
    onLoadedData: loadedData.on
  }
}

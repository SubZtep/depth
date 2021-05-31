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
    document.body.appendChild(video)
    video.addEventListener("loadeddata", () => {
      console.log("VIDEO LOADED DATA")
      loadedData.trigger(true)
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

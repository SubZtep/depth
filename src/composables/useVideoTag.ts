import type { Ref } from "vue"
import { ref, onMounted, onBeforeUnmount } from "vue"
import { createEventHook, until } from "@vueuse/core"

interface LoadedVideo {
  width: number
  height: number
  el: HTMLVideoElement
}

export function useVideoTag() {
  let el: Ref<HTMLVideoElement | undefined> = ref()
  const loadedData = createEventHook<LoadedVideo>()

  onMounted(() => {
    const video = document.createElement("video")
    video.playsInline = true
    video.muted = true
    video.controls = false
    video.autoplay = true
    video.style.position = "absolute"
    video.style.visibility = "hidden"
    document.body.appendChild(video)
    video.addEventListener("loadeddata", async ev => {
      const vel = ref(ev.target as typeof video)
      await until(vel).toMatch(v => v.readyState === 4)
      loadedData.trigger({
        width: vel.value.videoWidth,
        height: vel.value.videoHeight,
        el: video,
      })
    })
    el.value = video
  })

  onBeforeUnmount(() => {
    if (el.value) {
      el.value.pause()
    }
  })

  return {
    el,
    onLoadedData: loadedData.on,
  }
}

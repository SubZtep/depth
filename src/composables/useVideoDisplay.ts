interface VideoDisplayParams {
  video: Ref<HTMLVideoElement>
  src: Ref<string>
  autoplay?: boolean
  loop?: boolean
  loaded?: Fn
}

export function useVideoDisplay({ video, src, autoplay, loop, loaded }: VideoDisplayParams) {
  // autoplay && (v.autoplay = autoplay)
  // loop && (v.loop = loop)
  // autoplay && (get(video).autoplay = autoplay)
  // loop && (get(video).loop = loop)

  // if (autoplay !== undefined) {
  //   get(video).autoplay = autoplay
  // }

  // if (loop !== undefined) {
  //   get(video).loop = loop
  // }

  const setSrc = (newSrc: string) => {
    get(video).src = newSrc
  }

  onMounted(async () => {
    await until(video).not.toBeNull()
    watch(src, setSrc, { immediate: true })
    loaded && get(video).addEventListener("canplaythrough", loaded, { once: true })
  })

  onBeforeUnmount(() => {
    loaded && get(video).removeEventListener("canplaythrough", loaded)
    setSrc("")
  })
}

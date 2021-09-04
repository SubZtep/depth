interface VideoDisplayParams {
  video: Ref<HTMLVideoElement>
  src: Ref<string>
}

export function useVideoDisplay({ video, src }: VideoDisplayParams) {
  let stopWatchSrc: WatchStopHandle | undefined

  const setSrc = (newSrc: string) => {
    get(video).src = newSrc
  }

  onMounted(async () => {
    await until(video).not.toBeNull()
    stopWatchSrc = watch(src, setSrc)
  })

  onBeforeUnmount(() => {
    stopWatchSrc && stopWatchSrc()
    setSrc("")
  })
}

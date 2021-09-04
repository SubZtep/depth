import VIDEOS, { localFilename } from "../misc/videos"

export function useVideoFiles() {
  const selectList = () => ({
    "": "",
    ...Object.fromEntries(VIDEOS.map(file => [file, localFilename(file)])),
  })

  return {
    selectList
  }
}

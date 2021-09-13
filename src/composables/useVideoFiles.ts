import VIDEOS, { localFilename } from "../misc/videos"

export function useVideoFiles(moreFiles = {}) {
  const selectList = () => ({
    "": "",
    ...Object.fromEntries(VIDEOS.map(file => [file, localFilename(file)])),
    "jerk": "https://cl.phncdn.com/pics/gifs/037/551/861/37551861a.mp4",
  })

  return {
    selectList
  }
}

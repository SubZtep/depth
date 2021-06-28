interface GlobalState {
  poseDetection: boolean
  // folderOpen: {
  //   camera: boolean
  // },
  // cameraZoomToPile: boolean
}

interface PlayerState {
  name: string,
  videoRef: Ref<HTMLVideoElement>
  videoWidth: number
  videoHeight: number
  playing: boolean
}

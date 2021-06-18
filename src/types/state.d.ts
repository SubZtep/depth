interface CameraState {
  on: boolean
  deviceId: string
}

interface PileState {
  id: string
  // estimatePoses: boolean
  // visibleEl: boolean
  // visibleObj: boolean
  // objWidth: number
  position: {
    x: number
    y: number
    z: number
  },
  videoPlayer: {
    visibleEl: boolean
    visibleObj: boolean
    width: number
  }
}

interface GlobalState {
  camera: CameraState
  piles: PileState[]
}

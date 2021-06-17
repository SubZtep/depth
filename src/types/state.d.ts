interface CameraState {
  on: boolean
  deviceId: string
}

interface VideoState {
  id: string
  src: string
  estimatePoses: boolean
  visibleEl: boolean
  visibleObj: boolean
  model: TFModel
  addX: number
  addY: number
  addZ: number
}

interface OptionsState {
  skybox: number
}

interface GlobalState {
  camera: CameraState
  videos: VideoState[]
  options: OptionsState
}

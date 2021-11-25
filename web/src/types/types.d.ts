type VideoElementEvent = Event & { target: HTMLVideoElement }
// type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
interface Logger {
  info: (message: string) => void
  error: (message: string) => void
  // success: (message: string) => void
}

// type MetaSnail = {
//   uuid: string
//   name: string
//   color: number
//   // position: Vector
//   // rotation: Rotation
//   created_at: string
//   updated_at: string
// }

type Fn = () => void
type FnPr = () => Promise<void>
// type FnPr = <T = void>() => Promise<T>
type FnIs = () => boolean

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry | THREE.ConeGeometry, THREE.Material>

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

interface GlobalState {
  guiScale: number
}

interface Logger {
  info: (message: string) => void
  error: (message: string) => void
  // success: (message: string) => void
}

type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any

type VideoElementEvent = Event & { target: HTMLVideoElement }

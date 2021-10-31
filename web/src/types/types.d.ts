type PropType<T> = import("@vue/runtime-core").PropType<T>
type Fn = import("@VueUse/core").Fn

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry | THREE.ConeGeometry, THREE.Material>
type VideoElementEvent = Event & { target: HTMLVideoElement }
// type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
interface Logger {
  info: (message: string) => void
  error: (message: string) => void
  // success: (message: string) => void
}

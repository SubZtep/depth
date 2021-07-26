type Ref<T = any> = import("@vue/reactivity").Ref<T>
type Fn = () => void
type FnPr = <T = void>() => Promise<T>
type FnIs = () => boolean

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.Material>

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

interface GlobalState {
  guiScale: number
}

interface Logger {
  info: (message: string) => void
  error: (message: string) => void
  success: (message: string) => void
}

type Fn = () => void
type PrFn = () => Promise<void>

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.Material>

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

type InputDimensions = {
  videoWidth: number
  videoHeight: number
}

type ErrorHandler = (e: Error) => void

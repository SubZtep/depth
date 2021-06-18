import { debouncedWatch } from "@vueuse/core"
import * as THREE from "three"
import { useGlobalState } from "../store"

export function loadSkybox(scene: THREE.Scene, skyboxNumber = 14) {
  if (skyboxNumber < 1 || skyboxNumber > 15) {
    console.warn("a valid skybox number is between 1 and 15")
    return
  }

  const loader = new THREE.CubeTextureLoader()
  const onLoad = (texture: THREE.CubeTexture) => (scene.background = texture)
  const onProgress = (ev: ProgressEvent) => console.info("downloading skybox", ev)
  const onError = (err: ErrorEvent) => console.error(err)

  const load = (nr: number) => {
    const path = `/Classic Skybox/${String(nr).padStart(2, "0")}/`
    const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.jpg`)
    loader.setPath(path).load(urls, onLoad, onProgress, onError)
  }

  load(skyboxNumber)
  const { options } = useGlobalState()

  debouncedWatch(
    () => options.skybox,
    sb => load(sb),
    { immediate: false, debounce: 250 }
  )
}

export function videoMesh(video: HTMLVideoElement) {
  const geometry = new THREE.PlaneBufferGeometry()
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  const texture = new THREE.VideoTexture(video)
  material.map = texture
  material.needsUpdate = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = "video-player"
  return mesh
}

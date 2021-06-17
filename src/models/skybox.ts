import * as THREE from "three"

export function loadSkybox(scene: THREE.Scene, skyboxNumber = 14) {
  if (skyboxNumber < 1 || skyboxNumber > 15) {
    console.warn("a valid skybox number is between 1 and 15")
    return
  }

  const loader = new THREE.CubeTextureLoader()
  const path = `/Classic Skybox/${String(skyboxNumber).padStart(2, "0")}/`
  const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${skyboxNumber}_${side}.jpg`)
  const onLoad = (texture: THREE.CubeTexture) => (scene.background = texture)
  const onProgress = (ev: ProgressEvent) => console.info("downloading skybox", ev)
  const onError = (err: ErrorEvent) => console.error(err)

  loader.setPath(path).load(urls, onLoad, onProgress, onError)
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

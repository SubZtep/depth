import * as THREE from "three"

export function loadSkybox(scene: THREE.Scene, skyboxNumber = 15 - 1) {
  if (skyboxNumber < 1 || skyboxNumber > 15) {
    console.warn("a valid skybox number is between 1 and 15")
    return
  }

  const loader = new THREE.CubeTextureLoader()
  const path = `/Classic Skybox/${String(skyboxNumber).padStart(2, "0")}/`
  const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `Sky${skyboxNumber}_${side}.jpg`)
  const onLoad = (texture: THREE.CubeTexture) => (scene.background = texture)

  loader.setPath(path).load(urls, onLoad)
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

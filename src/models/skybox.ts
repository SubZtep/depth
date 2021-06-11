import * as THREE from "three"

export function loadSkybox(scene: THREE.Scene, skyboxNumber = 15 - 1) {
  if (skyboxNumber < 1 || skyboxNumber > 15) {
    console.warn("a valid skybox number is between 1 and 15")
    // skyboxNumber = 1
  }

  const loader = new THREE.CubeTextureLoader()
  const path = `/Classic Skybox/${String(skyboxNumber).padStart(2, "0")}/`
  const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `Sky${skyboxNumber}_${side}.jpg`)
  const onLoad = (texture: THREE.CubeTexture) => (scene.background = texture)

  loader.setPath(path).load(urls, onLoad)
}

export function videoMesh(video: HTMLVideoElement, scale: number = 1) {
  console.log("CREATE VIDEO MESH", [video.videoWidth, video.videoHeight])

  const width = video.videoWidth * scale
  const height = video.videoHeight * scale

  const geometry = new THREE.PlaneBufferGeometry(width, height)
  // const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  // const material = new THREE.MeshBasicMaterial({ side: THREE.FrontSide })
  const material = new THREE.MeshBasicMaterial({ side: THREE.FrontSide })

  const texture = new THREE.VideoTexture(video)
  // texture.flipY = false

  // flip x
  texture.wrapS = THREE.RepeatWrapping
  // texture.repeat.x = -1

  texture.encoding = THREE.sRGBEncoding
  material.map = texture
  material.needsUpdate = true

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.setX(width / 2)
  mesh.position.setY(height / 2)
  return {
    mesh,
    width,
    height,
  }
}

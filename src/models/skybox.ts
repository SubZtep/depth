import { CubeTextureLoader, CubeTexture } from "three"

export function loadSkybox(scene: THREE.Scene, skyboxNumber: SkyboxNumber = 14): Promise<void> {
  return new Promise((resolve, reject) => {
    if (skyboxNumber < 1 || skyboxNumber > 15) {
      return reject("a valid skybox number is between 1 and 15")
    }

    const loader = new CubeTextureLoader()
    const onError = (err: ErrorEvent) => reject(err)
    const onProgress = (ev: ProgressEvent) => console.info("downloading skybox", ev)
    const onLoad = (texture: CubeTexture) => {
      scene.background = texture
      return resolve()
    }

    const load = (nr: SkyboxNumber) => {
      const path = `/Classic Skybox/${String(nr).padStart(2, "0")}/`
      const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.jpg`)
      loader.setPath(path).load(urls, onLoad, onProgress, onError)
    }

    load(skyboxNumber)
  })
}

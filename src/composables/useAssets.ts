import { logLoaded } from "../misc/console"
import { CubeTextureLoader, CubeTexture, TextureLoader, MeshBasicMaterial, DoubleSide } from "three"

// export let noVideoMaterial: THREE.MeshBasicMaterial
const assets = new Map<string, unknown>()

export function useAssets() {

  const loadSkybox = (nr: SkyboxNumber): Promise<CubeTexture> => {
    return new Promise((resolve, reject) => {
      if (nr < 1 || nr > 15) {
        return reject("a valid skybox number is between 1 and 15")
      }

      const loader = new CubeTextureLoader()
      const onError = (err: ErrorEvent) => reject(err)
      const onProgress = (ev: ProgressEvent) => console.info("downloading skybox", ev)
      const onLoad = (texture: CubeTexture) => resolve(texture)

      const path = `/Classic Skybox/${String(nr).padStart(2, "0")}/`
      const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.jpg`)
      loader.setPath(path).load(urls, onLoad, onProgress, onError)
    })
  }

  const loadNoVideoMaterial = (): Promise<void> => {
    return new Promise((resolve, _reject) => {
      const loader = new TextureLoader()

      loader.load("no-video.png", map => {
        const noVideoMaterial = new MeshBasicMaterial({ map, transparent: true, side: DoubleSide })
        assets.set("noVideoMaterial", noVideoMaterial)
        logLoaded("noVideoMaterial")
        resolve()
      })
    })
  }

  return {
    loadSkybox,
    loadNoVideoMaterial,
    assets,
  }
}

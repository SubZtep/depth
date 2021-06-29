import { loadSkybox } from "src/models/skybox";
import { CubeTextureLoader, CubeTexture } from "three";
import { scene } from "./useThreeJs";

export function useLoader() {

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

  return { loadSkybox }
}

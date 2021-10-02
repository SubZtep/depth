import { logLoaded } from "~/misc/console"
import { CubeTexture, DoubleSide, LinearFilter, TextureLoader, MeshBasicMaterial, CubeTextureLoader, CubeReflectionMapping } from "three"
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader"

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
      const onLoad = (texture: CubeTexture) => {
        logLoaded(`Skybox #${nr}`)
        resolve(texture)
      }

      const path = `/skybox/${String(nr).padStart(2, "0")}/`
      const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.jpg`)
      loader.setPath(path).load(urls, onLoad, onProgress, onError)
    })
  }

  const loadNoVideoMaterial = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const loader = new TextureLoader()

      loader.load(
        "textures/no-video.png",
        map => {
          const noVideoMaterial = new MeshBasicMaterial({ map, transparent: true, side: DoubleSide })
          assets.set("noVideoMaterial", noVideoMaterial)
          logLoaded("noVideoMaterial")
          resolve()
        },
        undefined,
        reject
      )
    })
  }

  const loadLeafMaterial = (): Promise<MeshBasicMaterial> => {
    return new Promise((resolve, reject) => {
      const loader = new DDSLoader()
      loader.load(
        "textures/hepatica_dxt3_mip.dds",
        texture => {
          texture.anisotropy = 2
          texture.magFilter = LinearFilter
          texture.minFilter = LinearFilter
          texture.mapping = CubeReflectionMapping
          const material = new MeshBasicMaterial({
            map: texture,
            color: 0x696969,
            alphaTest: 0.5,
            side: DoubleSide,
          })
          assets.set("leafMaterial", material)
          logLoaded("leafMaterial")
          resolve(material)
        },
        undefined,
        reject
      )
    })
  }

  return {
    loadSkybox,
    loadNoVideoMaterial,
    loadLeafMaterial,
    assets,
  }
}

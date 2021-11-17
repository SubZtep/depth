import { ref, watch } from "vue"
import { exec3D } from "@depth/three.js"
import { CubeTexture } from "three/src/textures/CubeTexture"
import { CubeTextureLoader } from "three/src/loaders/CubeTextureLoader"

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

export function useSkybox(initNr: SkyboxNumber = 1, initCompressed = true) {
  const nr = ref<SkyboxNumber>(initNr)
  const compressed = ref<boolean>(initCompressed)

  const load = (nr: SkyboxNumber, compressed: boolean): Promise<CubeTexture> => {
    return new Promise((resolve, reject) => {
      if (nr < 1 || nr > 15) {
        return reject("a valid skybox number is between 1 and 15")
      }

      const loader = new CubeTextureLoader()
      const onError = (err: ErrorEvent) => reject(err)
      const onProgress = (ev: ProgressEvent) => console.info("downloading skybox", ev)
      const onLoad = (texture: CubeTexture) => resolve(texture)

      const path = `/textures/skybox/${String(nr).padStart(2, "0")}/`
      const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.${compressed ? "webp" : "jpg"}`)
      loader.setPath(path).load(urls, onLoad, onProgress, onError)
    })
  }

  const texture = ref<CubeTexture | null>(null)

  watch(
    [nr, compressed],
    async values => {
      texture.value = await load(values[0], values[1])
      exec3D(({ scene }) => (scene.background = texture.value))
    },
    {
      immediate: true,
    }
  )

  return {
    texture,
    nr,
    compressed,
  }
}

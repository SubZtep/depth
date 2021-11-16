import { ref, watch } from "vue"
import { CubeTexture, CubeTextureLoader } from "three"
import { exec3D } from "."

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

export function useSkybox(initNr?: SkyboxNumber) {
  const nr = ref<SkyboxNumber | undefined>(initNr)

  const load = (nr: SkyboxNumber): Promise<CubeTexture> => {
    return new Promise((resolve, reject) => {
      if (nr < 1 || nr > 15) {
        return reject("a valid skybox number is between 1 and 15")
      }

      const loader = new CubeTextureLoader()
      const onError = (err: ErrorEvent) => reject(err)
      const onProgress = (ev: ProgressEvent) => console.info("downloading skybox", ev)
      const onLoad = (texture: CubeTexture) => resolve(texture)

      const path = `/textures/skybox/${String(nr).padStart(2, "0")}/`
      const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.webp`)
      loader.setPath(path).load(urls, onLoad, onProgress, onError)
    })
  }

  watch(nr, async newNr => {
    if (newNr === undefined) return

    const txt = await load(newNr)
    exec3D(({ scene }) => (scene.background = txt))
  })

  return {
    nr,
  }
}

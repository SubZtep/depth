import { ref, watch } from "vue"
import { exec3D, CubeTexture, CubeTextureLoader } from "@depth/three.js"
import { useSingleton } from "@depth/misc"

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

interface SkyboxProperties {
  nr?: SkyboxNumber
  compressed?: boolean
}

const onProgress = (event: ProgressEvent) => console.info("downloading skybox", event)

export function useSkybox(properties: SkyboxProperties = {}) {
  const { singleton } = useSingleton()
  let { nr: initNr = 1, compressed: initCompressed = true } = properties

  let texture: CubeTexture | null
  if (singleton.has("Skybox")) {
    const s = singleton.get("Skybox")
    texture = s.texture
    initNr = s.nr
    initCompressed = s.compressed
  } else {
    // eslint-disable-next-line unicorn/no-null
    texture = null
    singleton.set("Skybox", { texture, nr: initNr, compressed: initCompressed })
  }

  const nr = ref<SkyboxNumber>(initNr)
  const compressed = ref<boolean>(initCompressed)

  const load = (nr: SkyboxNumber, compressed: boolean): Promise<CubeTexture> => {
    return new Promise((resolve, reject) => {
      if (nr < 1 || nr > 15) {
        return reject("a valid skybox number is between 1 and 15")
      }

      const loader = new CubeTextureLoader()
      const onError = (error: ErrorEvent) => reject(error)
      const onLoad = (texture: CubeTexture) => resolve(texture)

      const path = `/textures/skybox/${String(nr).padStart(2, "0")}/`
      const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.${compressed ? "webp" : "jpg"}`)
      loader.setPath(path).load(urls, onLoad, onProgress, onError)
    })
  }

  watch(
    [nr, compressed],
    async values => {
      texture = await load(values[0], values[1])
      exec3D(({ scene }) => (scene.background = texture))
    },
    {
      immediate: true,
    }
  )

  return {
    nr,
    compressed,
  }
}

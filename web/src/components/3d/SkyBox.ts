import { MaybeRef, whenever } from "@vueuse/core"
import { tryOnScopeDispose } from "@vueuse/core"
import { CubeTextureLoader } from "three/src/loaders/CubeTextureLoader"
import { CubeTexture } from "three/src/textures/CubeTexture"
import { getCurrentInstance, isReactive, isRef, onScopeDispose, PropType, unref } from "vue"

const onProgress = (event: ProgressEvent) => console.info("downloading skybox", event)

const load = (nr: number, compressed = true): Promise<CubeTexture> => {
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

export default defineComponent({
  props: {
    nr: { type: Number || (Object as PropType<MaybeRef<number>>) },
  },
  async setup(props) {
    const instance = getCurrentInstance()
    if (!instance) {
      throw new Error("Not in Vue scope")
    }

    const setBg = async (id: number) => {
      instance.appContext.app.config.globalProperties.$scene.background = await load(id)
    }

    // XXX: make a pattern
    if (isReactive(props) || isRef(props.nr)) {
      whenever(
        () => props.nr,
        async newNr => await setBg(newNr),
        { immediate: true }
      )
    } else if (props.nr) {
      await setBg(props.nr)
    }

    tryOnScopeDispose(() => {
      // eslint-disable-next-line unicorn/no-null
      instance.appContext.app.config.globalProperties.$scene.background = null
    })

    return () => {}
  },
})

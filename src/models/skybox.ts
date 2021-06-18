import type { EventHook } from "@vueuse/core"
import { inject } from "vue"
import * as THREE from "three"

export function loadSkybox(scene: THREE.Scene, skyboxNumber = 14) {
  if (skyboxNumber < 1 || skyboxNumber > 15) {
    console.warn("a valid skybox number is between 1 and 15")
    return
  }

  const loader = new THREE.CubeTextureLoader()
  const onLoad = (texture: THREE.CubeTexture) => (scene.background = texture)
  const onProgress = (ev: ProgressEvent) => console.info("downloading skybox", ev)
  const onError = (err: ErrorEvent) => console.error(err)

  const load = (nr: number) => {
    const path = `/Classic Skybox/${String(nr).padStart(2, "0")}/`
    const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.jpg`)
    loader.setPath(path).load(urls, onLoad, onProgress, onError)
  }

  load(skyboxNumber)
  inject<EventHook<GUIEvent.Options>>("optionsHook")?.on(({ skybox }) => load(skybox))
}

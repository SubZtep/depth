import type { Ref } from "vue"
import * as THREE from "three"
import { debouncedWatch } from "@vueuse/core"

export function useSkybox(scene: THREE.Scene, skyboxNumber: Ref<number>) {
  const loader = new THREE.CubeTextureLoader()

  debouncedWatch(
    skyboxNumber,
    value => {
      if (value < 1 || value > 15) {
        console.warn("a valid skybox number is between 1 and 15")
      }
      loader.setPath(`/Classic Skybox/${String(value).padStart(2, "0")}/`).load(
        ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `Sky${value}_${side}.jpg`),
        texture => (scene.background = texture)
      )
    },
    { immediate: true, debounce: 250 }
  )
}

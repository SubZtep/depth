import "vue-router"
import type { Vector3Tuple } from "three/src/math/Vector3"

declare module "vue-router" {
  interface RouteMeta {
    /** Camera position */
    position?: Vector3Tuple
    /** Camera rotation */
    lookAt?: Vector3Tuple
    /** Menu order if defined, otherwise not in the menu. */
    order?: number
  }
}

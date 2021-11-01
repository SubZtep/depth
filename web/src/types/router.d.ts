import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /** Camera position */
    position?: THREE.Vector3Tuple
    /** Camera rotation */
    lookAt?: THREE.Vector3Tuple
    /** Menu order if defined, otherwise not in the menu. */
    order?: number
  }
}

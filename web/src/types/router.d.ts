import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /** camera position */
    position?: THREE.Vector3Tuple
    /** camera rotation */
    lookAt?: THREE.Vector3Tuple
  }
}

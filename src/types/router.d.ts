interface Route {
  path: string,
  position: THREE.Vector3Tuple,
  lookAt: THREE.Vector3Tuple,
}

interface RouterOptions {
  routes: Route[],
  enableTransition?: boolean
}

interface RouterEvent {
  position: THREE.Vector3Tuple,
  lookAt: THREE.Vector3Tuple,
  enableTransition: boolean
}

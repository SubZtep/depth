interface BaseRoute {
  component: import("@vue/runtime-core").Component
  position: THREE.Vector3Tuple
  lookAt: THREE.Vector3Tuple
}

interface Route extends BaseRoute {
  path: string
}

interface RouterOptions {
  routes: Route[]
  enableTransition?: boolean
}

interface RouterEvent extends BaseRoute {
  enableTransition: boolean
}

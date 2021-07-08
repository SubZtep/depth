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
  transition?: boolean
}

interface RouterEvent extends BaseRoute {
  transition: boolean
}

type PathToRouteFn = (path: string) => Route | undefined
type OnRouterEventFn = (params: RouterEvent) => void
type PageComponent = Ref<Route["component"] | undefined>

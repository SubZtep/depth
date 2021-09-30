import type { Router, Route } from "~/types/settings"

interface BaseRoute {
  component: import("@vue/runtime-core").Component
  position?: THREE.Vector3Tuple
  lookAt?: THREE.Vector3Tuple
}

interface RouterEvent {
  component: import("@vue/runtime-core").Component
  transition: boolean

  path: string
  label?: string
  position?: [number, number, number]
  lookAt?: [number, number, number]
}

type PathToRouteFn = (path: string) => Route | undefined
type OnRouterEventFn = (params: RouterEvent) => void
type RouterOptions = Router

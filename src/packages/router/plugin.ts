import type { Plugin, Component } from "vue"
import type { EventHook } from "@vueuse/core"
import { createEventHook, set } from "@vueuse/core"

function banglessHash() {
  return window.location.hash.replace(/^(#)/, "")
}

function routeByPath(routes: Route[]) {
  return (windowPath = "/") => routes.find(({ path }) => path === windowPath)
}

const eventHookKey = Symbol("router event hook")
const eventHook = createEventHook<RouterEvent>()
let getRoute: PathToRouteFn

export default {
  install(app, options: RouterOptions) {
    const { routes, transition = true } = options

    getRoute = routeByPath(routes)
    app.provide(eventHookKey, eventHook)

    window.addEventListener("hashchange", () => {
      // console.log("BOO")
      // const route = getRoute(banglessHash())
      const route = useActiveRoute()
      route && eventHook.trigger({ ...route, transition })
    })
  },
} as Plugin

export function useOnRouterEvent(fn: OnRouterEventFn) {
  return inject<EventHook<RouterEvent>>(eventHookKey)!.on(fn)
}

export function useActiveRoute(): Route | undefined {
  return getRoute(banglessHash())
}

export function useActiveRouteComponent(): Component {
  const pageComponent = shallowRef(useActiveRoute()?.component)
  inject<EventHook<RouterEvent>>(eventHookKey)!.on(({ component }) => set(pageComponent, component))
  return pageComponent
}

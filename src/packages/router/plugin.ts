import type { Plugin, Component } from "vue"
import type { EventHook } from "@vueuse/core"
import type { Route } from "~/types/settings"
import type { RouterEvent, RouterOptions, PathToRouteFn, OnRouterEventFn } from "./types.d"
import { banglessHash, routeByPath } from "./utils"

const eventHookKey = Symbol("router event hook")
const eventHook = createEventHook<RouterEvent>()
let getRoute: PathToRouteFn

export default {
  install(app, options: RouterOptions) {
    const { routes, transition = false } = options

    getRoute = routeByPath(routes)
    app.provide(eventHookKey, eventHook)

    window.addEventListener("hashchange", () => {
      const route = useActiveRoute()
      if (!route) throw new Error("No route found")
      // @ts-ignore
      eventHook.trigger({ ...route, transition })
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
  inject<EventHook<RouterEvent>>(eventHookKey)!.on(route => set(pageComponent, route.component))
  return pageComponent
}

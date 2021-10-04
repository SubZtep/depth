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
    getRoute = routeByPath(options.routes)
    app.provide(eventHookKey, eventHook)

    window.addEventListener("hashchange", () => {
      const route = useActiveRoute()
      // @ts-ignore
      route && eventHook.trigger({ ...route, transition: options.transition })
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
  // @ts-ignore
  inject<EventHook<RouterEvent>>(eventHookKey)!.on(route => set(pageComponent, route.component))
  return pageComponent
}

import type { Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import { inject, shallowRef } from "vue"
import { createEventHook, set } from "@vueuse/core"

function banglessHash() {
  return window.location.hash.replace(/^(#)/, "")
}

function routeByPath(routes: Route[]) {
  return (windowPath = "/") => {
    const route = routes.find(({ path }) => path === windowPath)
    if (route === undefined) {
      throw new Error(`unknown route ${windowPath}`)
    }
    return route
  }
}

const eventHookKey = Symbol("router event hook")
const eventHook = createEventHook<RouterEvent>()

export default {
  install(app, options: RouterOptions) {
    const { routes, transition = true } = options
    const getRoute = routeByPath(routes)
    app.provide(eventHookKey, eventHook)
    window.addEventListener("hashchange", () => eventHook.trigger({ ...getRoute(banglessHash()), transition }))
  },
} as Plugin

export function useOnRouterEvent(fn: (params: RouterEvent) => void) {
  return inject<EventHook<RouterEvent>>(eventHookKey)!.on(fn)
}

export function useRoutedComponent() {
  const pageComponent = shallowRef<Route["component"]>()
  inject<EventHook<RouterEvent>>(eventHookKey)!.on(({ component }) => set(pageComponent, component))
  return pageComponent
}

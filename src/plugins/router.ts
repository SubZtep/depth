import type { Plugin } from "vue"
import { createEventHook } from "@vueuse/core"

export default {
  install(app, options: RouterOptions) {
    const { routes, enableTransition = true } = options

    const routeByPath = (routerPath = "/") => {
      const route = routes.find(({ path }) => path === routerPath)
      if (route === undefined) {
        throw new Error(`unknown route ${location.hash}`)
      }
      return route
    }

    const hook = createEventHook<RouterEvent>()
    app.provide("routerHook", hook)

    window.addEventListener("hashchange", () => {
      hook.trigger({ ...routeByPath(location.hash.replace(/^(#)/, "")), enableTransition })
    })
  },
} as Plugin

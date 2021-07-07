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
    // app.provide("routeByPath", routeByPath)

    window.addEventListener("hashchange", () => {
      hook.trigger({ ...routeByPath(location.hash.replace(/^(#)/, "")), enableTransition })
    })

    // app.mixin({
    //   name: "xxx",
    //   async mounted() {
    //     await sleep(1000)
    //     await nextTick()
    //     hook.trigger({ ...routeByPath(), enableTransition: true }) // start page
    //     console.log("KIGIIIG", app._context.app._component)
    //     delete app._context.mixins[app._context.mixins.findIndex(({ name }) => name === "xxx")]
    //   }
    // })

    // window.addEventListener("location", e => {
    //   console.log("LOCATION", e)
    // })
    // window.addEventListener("popstate", e => {
    //   console.log("POPSTATE", e)
    // })
    // window.addEventListener("beforeunload", e => {
    //   console.log("BEFOREUNLOAD", e)
    // })
  },
} as Plugin

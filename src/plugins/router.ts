import type { Plugin } from "vue"
import { createEventHook } from "@vueuse/core"

export default {
  install(app, options: RouterOptions) {
    const { routes, enableTransition = true } = options

    const hook = createEventHook<RouterEvent>()
    app.provide("routerHook", hook)

    window.addEventListener("hashchange", () => {
      const hash = location.hash.replace(/^(#)/, "")
      const route = routes.find(v => v.path === hash)
      if (route === undefined) {
        throw new Error(`unknown route ${location.hash}`)
      }

      hook.trigger({ ...route, enableTransition })
    })

    // window.addEventListener("location", e => {
    //   console.log("LOCATION", e)
    // })
    // window.addEventListener("popstate", e => {
    //   console.log("POPSTATE", e)
    // })
    // window.addEventListener("beforeunload", e => {
    //   console.log("BEFOREUNLOAD", e)
    // })
  }
} as Plugin

import type { Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import { createEventHook } from "@vueuse/core"

const eventHookKey = Symbol("ThreeJS event hook")

const eventHook = createEventHook<ThreeJSEvent>()
export default {
  install(app) {
    app.provide(eventHookKey, eventHook)
    // app.mixin({
    //   created() {
    //     //
    //   }
    // })
  },
} as Plugin

export function useThreeJSEventHook() {
  return inject<EventHook<ThreeJSEvent>>(eventHookKey)!
}
